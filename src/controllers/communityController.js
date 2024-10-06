// src/controllers/communityController.js

const Community = require('../models/community');
const User = require('../models/user');

const communityController = {
  async createCommunity(req, res) {
    try {
      const communityData = req.body;
      const newCommunity = await Community.create(communityData);
      res.status(201).json(newCommunity);
    } catch (error) {
      console.error('Error creating community:', error);
      res.status(500).json({ message: 'Failed to create community' });
    }
  },

  async getAllCommunities(req, res) {
    try {
      const communities = await Community.getAll();
      res.status(200).json(communities);
    } catch (error) {
      console.error('Error getting all communities:', error);
      res.status(500).json({ message: 'Failed to get communities' });
    }
  },

  async getCommunityById(req, res) {
    try {
      const { id } = req.params;
      const community = await Community.getById(id);
      if (community) {
        res.status(200).json(community);
      } else {
        res.status(404).json({ message: 'Community not found' });
      }
    } catch (error) {
      console.error('Error getting community:', error);
      res.status(500).json({ message: 'Failed to get community' });
    }
  },

  async updateCommunity(req, res) {
    try {
      const { id } = req.params;
      const communityData = req.body;
      const updatedCommunity = await Community.update(id, communityData);
      if (updatedCommunity) {
        res.status(200).json(updatedCommunity);
      } else {
        res.status(404).json({ message: 'Community not found' });
      }
    } catch (error) {
      console.error('Error updating community:', error);
      res.status(500).json({ message: 'Failed to update community' });
    }
  },

  async deleteCommunity(req, res) {
    try {
      const { id } = req.params;
      await Community.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting community:', error);
      res.status(500).json({ message: 'Failed to delete community' });
    }
  },

  async joinCommunity(req, res) {
    try {
      const { communityId } = req.params;
      const userId = req.user.id;
      await User.addToCommunity(userId, communityId);
      res.status(200).json({ message: 'Successfully joined community' });
    } catch (error) {
      console.error('Error joining community:', error);
      res.status(500).json({ message: 'Failed to join community' });
    }
  },

  async leaveCommunity(req, res) {
    try {
      const { communityId } = req.params;
      const userId = req.user.id;
      await User.removeFromCommunity(userId, communityId);
      res.status(200).json({ message: 'Successfully left community' });
    } catch (error) {
      console.error('Error leaving community:', error);
      res.status(500).json({ message: 'Failed to leave community' });
    }
  },

  async getCommunityMembers(req, res) {
    try {
      const { communityId } = req.params;
      const members = await Community.getMembers(communityId);
      res.status(200).json(members);
    } catch (error) {
      console.error('Error getting community members:', error);
      res.status(500).json({ message: 'Failed to get community members' });
    }
  },

  async updateMemberRole(req, res) {
    try {
      const { communityId, userId } = req.params;
      const { role } = req.body;
      await Community.updateMemberRole(communityId, userId, role);
      res.status(200).json({ message: 'Successfully updated member role' });
    } catch (error) {
      console.error('Error updating member role:', error);
      res.status(500).json({ message: 'Failed to update member role' });
    }
  },

  async checkMembership(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isMember = await Community.checkMembership(id, userId);
      res.status(200).json({ isMember });
    } catch (error) {
      console.error('Error checking membership:', error);
      res.status(500).json({ message: 'Failed to check membership' });
    }
  }
};

module.exports = communityController;
