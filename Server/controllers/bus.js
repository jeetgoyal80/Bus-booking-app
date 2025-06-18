import Bus from '../models/Bus.js';


// Get bus details by busId
export const getBusDetailsById = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById( busId );

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error getting bus by ID:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get buses by from, to, and optional date
export const getBusesBy = async (req, res) => {
  try {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({ message: 'from, to and date are required' });
    }

    // Validate date format (optional but useful)
    if (isNaN(new Date(date))) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Normalize input
    const fromRegex = new RegExp(`^${from.trim()}$`, 'i');
    const toRegex = new RegExp(`^${to.trim()}$`, 'i');

    // Find buses matching location (date is not checked here)
    const buses = await Bus.find({
      from: { $regex: fromRegex },
      to: { $regex: toRegex },
    });

    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No buses found for the selected route',
      });
    }

    // Send matched buses
    res.status(200).json({
      success: true,
      buses,
    });
  } catch (error) {
    console.error('Error fetching buses:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
