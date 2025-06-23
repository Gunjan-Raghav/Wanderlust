const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing= require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


//INDEX ROUTE
router
.route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing))
 

    //NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);
    //SHOW ROUTE
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,wrapAsync(listingController.deleteListing))
  
    

        //EDIT ROUTE
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing));
        

module.exports=router;