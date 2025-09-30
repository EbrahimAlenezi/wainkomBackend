import { Request, Response } from "express";
import { Org } from "../../model/Organizer";
import { User } from "../../model/User";
import { Event } from "../../model/Event";

//working
export const createOrganizer = async (req: Request, res: Response) => {
 try {
    console.log("createOrganizer function called");
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }
    
    const { name, address, image, bio, phone, website } = req.body;
    const organizer = await Org.create({ 
      owner: authUser._id,
      name, 
      address, 
      image, 
      bio, 
      phone, 
      website 
    });
    
    await user.updateOne({ $set: { organization: organizer._id } });
    res.status(201).json(organizer);
 } catch (error) {
    res.status(500).json({ error: error });
 }
};

//working
export const getMyOrganizer = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }

    const organizer = await Org.findOne({ owner: authUser._id })
      .populate({
        path: 'events',
        populate: {
          path: 'categoryId',
          select: 'name'
        }
      });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer profile not found" });
    }

    console.log("Organizer found:", organizer.name);
    console.log("Events array length:", organizer.events ? organizer.events.length : 0);
    console.log("Events array:", organizer.events);

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//working
export const updateOrganizer = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }

    const { id } = req.params;
    const updateData = req.body;

    console.log("Update request - Organizer ID:", id);
    console.log("Update request - User ID:", authUser._id);
    console.log("Update request - Body:", updateData);

    // Find the organizer profile owned by this user
    const organizer = await Org.findOne({ _id: id, owner: authUser._id });
    console.log("Found organizer:", organizer ? "Yes" : "No");
    
    if (!organizer) {
      // Let's check if the organizer exists at all
      const anyOrganizer = await Org.findById(id);
      console.log("Organizer exists in DB:", anyOrganizer ? "Yes" : "No");
      if (anyOrganizer) {
        console.log("Organizer owner:", anyOrganizer.owner);
        console.log("Requesting user:", authUser._id);
      }
      return res.status(404).json({ message: "Organizer profile not found or you don't have permission to update it" });
    }

    // Only update fields that are provided in the request body
    const allowedFields = ['name', 'address', 'image', 'bio', 'phone', 'website'];
    const filteredUpdateData: any = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    // Update the organizer profile with only the provided fields
    const updatedOrganizer = await Org.findByIdAndUpdate(
      id,
      filteredUpdateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOrganizer);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const addEventToOrganizer = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user || user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }

    const { organizerId, eventId } = req.body;

    // Find the organizer profile owned by this user
    const organizer = await Org.findOne({ _id: organizerId, owner: authUser._id });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer profile not found" });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is already in the organizer's events array
    if (organizer.events.includes(eventId)) {
      return res.status(400).json({ message: "Event is already assigned to this organizer" });
    }

    // Add the event to the organizer's events array
    const updatedOrganizer = await Org.findByIdAndUpdate(
      organizerId,
      { $addToSet: { events: eventId } }, // $addToSet prevents duplicates
      { new: true }
    ).populate({
      path: 'events',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Event added to organizer successfully",
      organizer: updatedOrganizer
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const removeEventFromOrganizer = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user || user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }

    const { organizerId, eventId } = req.body;

    // Find the organizer profile owned by this user
    const organizer = await Org.findOne({ _id: organizerId, owner: authUser._id });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer profile not found" });
    }

    // Remove the event from the organizer's events array
    const updatedOrganizer = await Org.findByIdAndUpdate(
      organizerId,
      { $pull: { events: eventId } }, // $pull removes the event from array
      { new: true }
    ).populate({
      path: 'events',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });

    // Also remove the organizer reference from the event
    await Event.findByIdAndUpdate(eventId, { $unset: { orgId: 1 } });

    res.status(200).json({
      message: "Event removed from organizer successfully",
      organizer: updatedOrganizer
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateOrganizerEvents = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user || user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }

    const { organizerId, events } = req.body; // events should be an array of event IDs

    // Find the organizer profile owned by this user
    const organizer = await Org.findOne({ _id: organizerId, owner: authUser._id });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer profile not found" });
    }

    // Validate that all events exist
    const existingEvents = await Event.find({ _id: { $in: events } });
    if (existingEvents.length !== events.length) {
      return res.status(400).json({ message: "Some events do not exist" });
    }

    // Replace the entire events array
    const updatedOrganizer = await Org.findByIdAndUpdate(
      organizerId,
      { events: events }, // Replace the entire array
      { new: true }
    ).populate({
      path: 'events',
      populate: {
        path: 'categoryId',
        select: 'name'
      }
    });

    res.status(200).json({
      message: "Organizer events updated successfully",
      organizer: updatedOrganizer
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const assignEventToOrganizer = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }

    const { organizerId, eventId } = req.body;

    // Find the organizer profile owned by this user
    const organizer = await Org.findOne({ _id: organizerId, owner: authUser._id });
    if (!organizer) {
      return res.status(404).json({ message: "Organizer profile not found or you don't have permission to assign events to it" });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is already assigned to this organizer
    if (event.orgId.toString() === organizerId) {
      return res.status(400).json({ message: "Event is already assigned to this organizer" });
    }

    // Check if event is assigned to another organizer
    if (event.orgId) {
      return res.status(400).json({ message: "Event is already assigned to another organizer" });
    }

    // Update the event to assign it to the organizer
    await Event.findByIdAndUpdate(eventId, { orgId: organizerId });

    // Add the event to the organizer's events array
    await Org.findByIdAndUpdate(
      organizerId,
      { $push: { events: eventId } }
    );

    // Get the updated organizer with populated events
    const updatedOrganizer = await Org.findById(organizerId)
      .populate({
        path: 'events',
        populate: {
          path: 'categoryId',
          select: 'name'
        }
      });

    res.status(200).json({ 
      message: "Event successfully assigned to organizer",
      organizer: updatedOrganizer,
      assignedEvent: event
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};