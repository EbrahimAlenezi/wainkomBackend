import { Request, Response } from "express";
import { Category } from "../../model/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getCategories = async (req: Request, res: Response) => { 
  const categories = await Category.find();
  res.status(200).json(categories);
};export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // مرر كل الـ body مش بس name
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: req.body }, // <-- يحدّث كل الحقول اللي تجي في body
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
