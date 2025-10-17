import { Storage, STORAGE_KEYS } from "./storage";
import type {
  User, Innovation, Pitch, PitchDetails, Analytics, Traffic,
  Opportunity, Application, Profile, Connection, Team, Message,
  MessageThread, Notification, Event, Prompt, Badge as UserBadge
} from "@/types";

// Simulate API latency
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Extended API functions for all missing features
export const connectionsAPI = {
  async sendConnect(toUserId: string): Promise<Connection> {
    await delay();
    const connections = await Storage.getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS) || [];
    const newConnection: Connection = {
      id: Date.now().toString(),
      fromId: "current-user",
      toId: toUserId,
      type: 'connect',
      status: 'requested',
      createdAt: new Date().toISOString()
    };
    connections.push(newConnection);
    await Storage.setItem(STORAGE_KEYS.CONNECTIONS, connections);
    return newConnection;
  },

  async respondConnect(connectionId: string, status: 'accepted' | 'declined'): Promise<void> {
    await delay();
    const connections = await Storage.getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS) || [];
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      connection.status = status;
      await Storage.setItem(STORAGE_KEYS.CONNECTIONS, connections);
    }
  },

  async requestNDA(innovationId: string, investorId: string): Promise<Connection> {
    await delay();
    const connections = await Storage.getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS) || [];
    const newConnection: Connection = {
      id: Date.now().toString(),
      fromId: "current-user",
      toId: investorId,
      type: 'nda',
      status: 'requested',
      createdAt: new Date().toISOString()
    };
    connections.push(newConnection);
    await Storage.setItem(STORAGE_KEYS.CONNECTIONS, connections);
    return newConnection;
  },

  async approveNDA(connectionId: string, approved: boolean): Promise<void> {
    await delay();
    const connections = await Storage.getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS) || [];
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      connection.status = approved ? 'accepted' : 'declined';
      await Storage.setItem(STORAGE_KEYS.CONNECTIONS, connections);
    }
  }
};

export const opportunitiesAPI = {
  async postOpportunity(payload: Partial<Opportunity>): Promise<Opportunity> {
    await delay();
    const opportunities = await Storage.getItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES) || [];
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      ownerId: "current-user",
      role: payload.role || "",
      description: payload.description || "",
      deliverables: payload.deliverables || [],
      commitment: payload.commitment || { hoursPerWeek: 0, durationWeeks: 0, startDate: "" },
      compensation: payload.compensation || { type: 'volunteer' },
      location: payload.location || 'remote',
      tags: payload.tags || [],
      status: 'open',
      createdAt: new Date().toISOString(),
      ...payload
    };
    opportunities.push(newOpportunity);
    await Storage.setItem(STORAGE_KEYS.OPPORTUNITIES, opportunities);
    return newOpportunity;
  },

  async updateOpportunity(id: string, payload: Partial<Opportunity>): Promise<void> {
    await delay();
    const opportunities = await Storage.getItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES) || [];
    const index = opportunities.findIndex(o => o.id === id);
    if (index !== -1) {
      opportunities[index] = { ...opportunities[index], ...payload };
      await Storage.setItem(STORAGE_KEYS.OPPORTUNITIES, opportunities);
    }
  },

  async closeOpportunity(id: string): Promise<void> {
    await delay();
    await this.updateOpportunity(id, { status: 'closed' });
  },

  async applyOpportunity(opportunityId: string, creatorId: string, message: string, portfolio: string[]): Promise<Application> {
    await delay();
    const applications = await Storage.getItem<Application[]>(STORAGE_KEYS.APPLICATIONS) || [];
    const newApplication: Application = {
      id: Date.now().toString(),
      opportunityId,
      creatorId,
      message,
      portfolio,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    applications.push(newApplication);
    await Storage.setItem(STORAGE_KEYS.APPLICATIONS, applications);
    return newApplication;
  },

  async shortlistApplicant(applicationId: string): Promise<void> {
    await delay();
    const applications = await Storage.getItem<Application[]>(STORAGE_KEYS.APPLICATIONS) || [];
    const application = applications.find(a => a.id === applicationId);
    if (application) {
      application.status = 'shortlisted';
      await Storage.setItem(STORAGE_KEYS.APPLICATIONS, applications);
    }
  },

  async declineApplicant(applicationId: string): Promise<void> {
    await delay();
    const applications = await Storage.getItem<Application[]>(STORAGE_KEYS.APPLICATIONS) || [];
    const application = applications.find(a => a.id === applicationId);
    if (application) {
      application.status = 'declined';
      await Storage.setItem(STORAGE_KEYS.APPLICATIONS, applications);
    }
  }
};

export const teamsAPI = {
  async createTeam(payload: Partial<Team>): Promise<Team> {
    await delay();
    const teams = await Storage.getItem<Team[]>(STORAGE_KEYS.TEAMS) || [];
    const newTeam: Team = {
      id: Date.now().toString(),
      innovationId: payload.innovationId || "",
      name: payload.name || "",
      members: payload.members || ["current-user"],
      roles: payload.roles || { "current-user": 'owner' },
      pinned: [],
      files: [],
      milestones: [],
      createdAt: new Date().toISOString(),
      ...payload
    };
    teams.push(newTeam);
    await Storage.setItem(STORAGE_KEYS.TEAMS, teams);
    return newTeam;
  },

  async addTeamMember(teamId: string, userId: string, role: 'owner' | 'admin' | 'member' | 'guest'): Promise<void> {
    await delay();
    const teams = await Storage.getItem<Team[]>(STORAGE_KEYS.TEAMS) || [];
    const team = teams.find(t => t.id === teamId);
    if (team) {
      if (!team.members.includes(userId)) {
        team.members.push(userId);
      }
      team.roles[userId] = role;
      await Storage.setItem(STORAGE_KEYS.TEAMS, teams);
    }
  },

  async uploadTeamFile(teamId: string, file: { name: string; url: string }): Promise<void> {
    await delay();
    const teams = await Storage.getItem<Team[]>(STORAGE_KEYS.TEAMS) || [];
    const team = teams.find(t => t.id === teamId);
    if (team) {
      team.files.push(file);
      await Storage.setItem(STORAGE_KEYS.TEAMS, teams);
    }
  },

  async toggleMilestone(teamId: string, milestoneId: string): Promise<void> {
    await delay();
    const teams = await Storage.getItem<Team[]>(STORAGE_KEYS.TEAMS) || [];
    const team = teams.find(t => t.id === teamId);
    if (team) {
      const milestone = team.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.done = !milestone.done;
        await Storage.setItem(STORAGE_KEYS.TEAMS, teams);
      }
    }
  }
};

export const messagesAPI = {
  async createThread(participantIds: string[]): Promise<MessageThread> {
    await delay();
    const threads = await Storage.getItem<MessageThread[]>(STORAGE_KEYS.THREADS) || [];
    const newThread: MessageThread = {
      id: Date.now().toString(),
      type: participantIds.length === 2 ? 'dm' : 'team',
      participantIds,
      lastMessageAt: new Date().toISOString()
    };
    threads.push(newThread);
    await Storage.setItem(STORAGE_KEYS.THREADS, threads);
    return newThread;
  },

  async sendMessage(payload: Partial<Message>): Promise<Message> {
    await delay();
    const messages = await Storage.getItem<Message[]>(STORAGE_KEYS.MESSAGES) || [];
    const newMessage: Message = {
      id: Date.now().toString(),
      threadId: payload.threadId || "",
      fromId: "current-user",
      text: payload.text,
      createdAt: new Date().toISOString(),
      ...payload
    };
    messages.push(newMessage);
    await Storage.setItem(STORAGE_KEYS.MESSAGES, messages);

    // Update thread last message time
    const threads = await Storage.getItem<MessageThread[]>(STORAGE_KEYS.THREADS) || [];
    const thread = threads.find(t => t.id === newMessage.threadId);
    if (thread) {
      thread.lastMessageAt = newMessage.createdAt;
      await Storage.setItem(STORAGE_KEYS.THREADS, threads);
    }

    return newMessage;
  }
};

export const eventsAPI = {
  async createEvent(payload: Partial<Event>): Promise<Event> {
    await delay();
    const events = await Storage.getItem<Event[]>(STORAGE_KEYS.EVENTS) || [];
    const newEvent: Event = {
      id: Date.now().toString(),
      type: 'meetup',
      title: payload.title || "",
      description: payload.description || "",
      startISO: payload.startISO || "",
      rsvpIds: payload.rsvpIds || [],
      ...payload
    };
    events.push(newEvent);
    await Storage.setItem(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  async rsvpEvent(eventId: string, userId: string): Promise<void> {
    await delay();
    const events = await Storage.getItem<Event[]>(STORAGE_KEYS.EVENTS) || [];
    const event = events.find(e => e.id === eventId);
    if (event && !event.rsvpIds.includes(userId)) {
      event.rsvpIds.push(userId);
      await Storage.setItem(STORAGE_KEYS.EVENTS, events);
    }
  },

  async setWeeklyPrompt(text: string): Promise<Prompt> {
    await delay();
    const prompts = await Storage.getItem<Prompt[]>(STORAGE_KEYS.PROMPTS) || [];
    const currentWeek = new Date().toISOString().slice(0, 10);
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      text,
      weekISO: currentWeek
    };
    prompts.push(newPrompt);
    await Storage.setItem(STORAGE_KEYS.PROMPTS, prompts);
    return newPrompt;
  }
};

export const notificationsAPI = {
  async pushNotification(payload: Partial<Notification>): Promise<Notification> {
    await delay();
    const notifications = await Storage.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: payload.type || 'system',
      title: payload.title || "",
      body: payload.body || "",
      read: false,
      createdAt: new Date().toISOString(),
      ...payload
    };
    notifications.unshift(newNotification); // Add to beginning
    await Storage.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotification;
  },

  async markNotificationRead(id: string): Promise<void> {
    await delay();
    const notifications = await Storage.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      await Storage.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }
};

export const badgesAPI = {
  async awardBadge(userId: string, badge: 'Top Innovator' | 'Community Builder' | 'Mentor'): Promise<UserBadge> {
    await delay();
    const badges = await Storage.getItem<UserBadge[]>(STORAGE_KEYS.BADGES) || [];
    const newBadge: UserBadge = {
      userId,
      badge,
      awardedAt: new Date().toISOString()
    };
    badges.push(newBadge);
    await Storage.setItem(STORAGE_KEYS.BADGES, badges);
    return newBadge;
  }
};