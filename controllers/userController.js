const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'firstName lastName email role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'firstName lastName email role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user (Admin or self)
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, 'firstName lastName email role');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};