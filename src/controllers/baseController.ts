import { Request, Response } from 'express';
import { Model } from 'mongoose';

class BaseController<T>{
    model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }

    // Create new object
    async post (req: Request, res: Response) {
        try {
            const created = await this.model.create(req.body)
            res.status(201).json(created);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message }); // Handle server errors
        }
    }

    // Get All objects
    async getAll (req: Request, res: Response) {
    const filter = req.query.owner;
    try {
        if (filter) {
        const all = await this.model.find({ owner: filter });
        res.send(all);
        } else {
        const all = await this.model.find();
        res.send(all);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
    };

    // Get object by ID
    async get (req: Request, res: Response) {
        const modelId = req.params.id;
        try {
        const found = await this.model.findById(modelId);
        if (found) {
            res.send(found);
        } else {
            res.status(404).send("object not found");
        }
        } catch (error) {
        res.status(400).send(error.message);
        }
    };


    // Update object data
    async update (req: Request, res: Response) {
    const modelId = req.params.id;
    const modelData = req.body;

    try {
        const found = await this.model.findById(modelId);
        if (!found) {
        return res.status(404).json({ error: 'object not found' });
        }
        
        Object.assign(found, modelData);
        
        await found.save();
        return res.status(200).json(found);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating object: ' + error.message });
    }
    };

    // Delete object by ID
    async delete (req: Request, res: Response) {
    try {
        const modelId = req.params.id;

        // Find the object by ID and delete it
        const deletedObject = await this.model.findByIdAndDelete(modelId);

        if (!deletedObject) {
            return res.status(404).json({ error: 'object not found' });
        }

        // Return a success message
        res.status(200).json({ message: 'Object deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' }); // Handle server errors
    }
    };


}

const createController = <T>(model: Model<T>) => new BaseController<T>(model);
export default createController;