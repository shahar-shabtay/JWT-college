import User from '../models/users';

// Add a New user
const addUser = async (req, res) => {
    try {
        const { name, username, email} = req.body;

        // Create and save the user
        const user = new User({ name, username, email });
        await user.save();
        res.status(201).json(user); // Respond with the created user
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};

// Get All users
const getAllusers = async (req, res) => {
  const filter = req.query.owner;
  try {
    if (filter) {
      const users = await User.find({ owner: filter });
      res.send(users);
    } else {
      const users = await User.find();
      res.send(users);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get user by ID
const getuserById = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send("user not found");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };


// Update user data
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    
    Object.assign(user, userData);
    
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating user: ' + error.message });
  }
};

// Delete a user by ID
const deleteUserByID = async (req, res) => {
  try {
      const userId = req.params.id; // Extract user ID from the URL

      // Find the user by ID and delete it
      const deleteduser = await User.findByIdAndDelete(userId);

      if (!deleteduser) {
          return res.status(404).json({ error: 'user not found' }); // Handle case where user doesn't exist
      }

      // Return a success message
      res.status(200).json({ message: 'user deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' }); // Handle server errors
  }
};

export const userController = {
  addUser,
  getAllusers,
  getuserById,
  updateUser, 
  deleteUserByID
};
