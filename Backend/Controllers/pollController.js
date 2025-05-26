import Poll from "../models/poll.js";

export const createPoll = async (req, res) => {
  const { question, options } = req.body;
  const folder = req.params.folderId;
  const createdBy = req.user._id;

  if (!question || !options || options.length < 2)
    return res.status(400).json({ message: "Question and at least 2 options required" });

  const poll = new Poll({ question, options: options.map(text => ({ text })), createdBy, folder });
  await poll.save();
  res.status(201).json(poll);
};

export const votePoll = async (req, res) => {
  const { optionIndex } = req.body;
  const pollId = req.params.pollId;
  const userId = req.user._id;

  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ message: "Poll not found" });

  // Prevent duplicate vote
  const alreadyVoted = poll.options.some(opt => opt.votes.includes(userId));
  if (alreadyVoted) return res.status(400).json({ message: "Already voted" });

  poll.options[optionIndex].votes.push(userId);
  await poll.save();
  res.json(poll);
};

export const getPollsByFolder = async (req, res) => {
  const polls = await Poll.find({ folder: req.params.folderId })
    .populate("createdBy", "name")
    .populate("options.votes", "name");

  res.json(polls);
};
