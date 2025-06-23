
mapboxgl.accessToken=mapToken;


 fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${listing.location}.json?access_token=${mapToken}`)
  .then(response => response.json())
  .then(data => {
    const [longitude, latitude] = data.features[0].center;

    listing.geometry = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    // Now initialize the map here
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: listing.geometry.coordinates,
      zoom: 9
    });

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
        )
      )
      .addTo(map);

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
  });
