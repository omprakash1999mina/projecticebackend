import { User } from "../../models";
import CustomErrorHandler from "../../Services/CustomerrorHandler";
import bcrypt from 'bcrypt';
import Joi from 'joi';

const userController = {
    async getUsersOne(req, res, next) {
        //  use pagination here for big data library is mongoose pagination

        let document;
        try {
            document = await User.findOne({ _id: req.params.id }).select('-updatedAt -__v -createdAt -password');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },

    async update(req, res, next) {
        // validation
        const updateSchema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            gender: Joi.string().required(),
            age: Joi.string().required(),
            password: Joi.string().min(8).required(),
            email: Joi.string().email().required(),
            image: Joi.string().max(500),
        });

        const { error } = updateSchema.validate(req.body);
        if (error) {
            // Delete the uploaded file


            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            // const exist = await User.exists({email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            //password varification
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                // Delete the uploaded file

                return next(CustomErrorHandler.wrongCredentials());
            }

            // const { name, price, size } = req.body;
            const { name, email, age, gender, image } = req.body;
            let document;

            document = await User.findOneAndUpdate({ _id: req.params.id }, {
                name,
                age,
                gender,
                email,
                image
            }).select('-updatedAt -__v -createdAt');
            // console.log(document);
            if (req.file) {
                // Delete the uploaded old file
                
                console.log("successfully deleted old file")
            }

        } catch (err) {
            // Delete the uploaded file

            return next(CustomErrorHandler.alreadyExist('This email is not registered please contact to technical team ! . '));
        }
        res.status(201).json({ status: "success", msg: "Updated Successfully." });
    }

}

export default userController;
