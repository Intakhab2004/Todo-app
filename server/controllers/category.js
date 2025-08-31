const Category = require("../models/Category");
const User = require("../models/User");

exports.createCategory = async(req, res) => {
    try{
        const { name } = req.body;
        const userId = req.user.id;
        if(!name){
            console.log("Name of the category is required");
            return res.status(400).json({
                success: false,
                message: "Name of the category is required"
            })
        }

        const user = await User.findById(userId);
        if(!user){
            console.log("User not found with the given Id");
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const currentCategory = await Category.findOne({name});
        if(currentCategory){
            console.log("Category is there with the same name");
            return res.status(401).json({
                success: false,
                message: "Category is already present"
            })
        }

        const newCategory = await Category.create({name, userId});
        if(!newCategory){
            return res.status(400).json({
                success: false,
                message: "An error occured while creating the category"
            })
        }

        return res.status(200).json({
            success: true,
            message: "New Category created successfully",
            newCategory
        })
    }
    catch(error){
        console.log("Something went wrong while creating category");
        console.error("An error occured: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.getCategory = async(req, res) => {
    try{
        const userId = req.user.id;
        
        const userCategory = await Category.find({userId});
        if(!userCategory){
            return res.status(403).json({
                success: false,
                message: "An error occured on fetching the category"
            })
        }

        return res.status(200).json({
            success: true,
            message: "category fetched successfully",
            userCategory
        })
    }
    catch(error){
        console.log("Something went wrong while fetching category");
        console.error("An error occured: ", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}