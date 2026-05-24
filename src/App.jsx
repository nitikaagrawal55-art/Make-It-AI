import React, { useState, useEffect, useRef } from "react";
import { INITIAL_AGENTS, INITIAL_REQUESTS, CATEGORIES } from "./data";
import AgentCard from "./components/AgentCard";
import IdeaRequestCard from "./components/IdeaRequestCard";
import CreateIdeaModal from "./components/CreateIdeaModal";
import LucideIcon from "./components/LucideIcon";

// Import custom subcomponents matching sleek interface roles & authenticators
import AuthModal from "./components/AuthModal";
import EnterpriseSubscriptionModal from "./components/EnterpriseSubscriptionModal";
import ClothingFitterWorkspace from "./components/ClothingFitterWorkspace";
import MarketingWorkspace from "./components/MarketingWorkspace";
import DataAnalyzerWorkspace from "./components/DataAnalyzerWorkspace";

export default function App() {
  // --- Persistent State Hooks ---
  const [agents, setAgents] = useState(() => {
    const local = localStorage.getItem("ai_workspace_agents");
    return local ? JSON.parse(local) : INITIAL_AGENTS;
  });

  const [requests, setRequests] = useState(() => {
    const local = localStorage.getItem("ai_workspace_requests");
    return local ? JSON.parse(local) : INITIAL_REQUESTS;
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const local = localStorage.getItem("ai_workspace_subscriptions");
    if (local) return JSON.parse(local);
    // Subscribe to first (free platform tool) and second agent originally
    return [
      { agentId: "agent-multilingual-blog", subscribedAt: "2026-05-18", renewalDate: "2026-06-18", price: 3.99 }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const local = localStorage.getItem("ai_workspace_transactions");
    return local ? JSON.parse(local) : [
      {
        id: "tx-init-1",
        agentId: "agent-multilingual-blog",
        agentName: "Global Content Brand Localizer",
        type: "builder_commission",
        amount: 2.79, // 70% of $3.99
        timestamp: "2026-05-23T10:14:00Z",
        subscriberName: "Alexander K."
      },
      {
        id: "tx-init-2",
        agentId: "agent-saas-concept",
        agentName: "SaaS Blueprint Architect",
        type: "idea_suggester_commission",
        amount: 2.70, // 30% of $8.99 for recommending original concept
        timestamp: "2026-05-24T05:22:00Z",
        subscriberName: "Yuvraj Sharma"
      }
    ];
  });

  const [userState, setUserState] = useState(() => {
    const local = localStorage.getItem("ai_workspace_user");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return {
          balance: typeof parsed.balance === "number" ? parsed.balance : 5.49,
          subscribersToMyAgents: typeof parsed.subscribersToMyAgents === "number" ? parsed.subscribersToMyAgents : 2,
          email: parsed.email || "nitikaagrawal555@gmail.com",
          name: parsed.name || "Nitika Agrawal",
          subscribedAgentIds: parsed.subscribedAgentIds || ["agent-multilingual-blog"],
          myCreatedAgentIds: parsed.myCreatedAgentIds || ["agent-multilingual-blog"],
          stripeConnected: !!parsed.stripeConnected,
          isLogged: parsed.isLogged !== undefined ? !!parsed.isLogged : true,
          hasEnterpriseSubscription: !!parsed.hasEnterpriseSubscription
        };
      } catch (e) {
        // ignored
      }
    }
    return {
      balance: 5.49, // initial earnings
      subscribersToMyAgents: 2,
      email: "nitikaagrawal555@gmail.com",
      name: "Nitika Agrawal",
      subscribedAgentIds: ["agent-multilingual-blog"],
      myCreatedAgentIds: ["agent-multilingual-blog"],
      stripeConnected: false,
      isLogged: true,
      hasEnterpriseSubscription: false
    };
  });

  // --- Active Session Hooks (Ephemeral UI states) ---
  const [activeTab, setActiveTab] = useState("workspace");
  const [librarySubTab, setLibrarySubTab] = useState("store");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [librarySearch, setLibrarySearch] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const handlePromoteMyAgents = () => {
    const myAgents = agents.filter(a => a.isUserCreated || userState.myCreatedAgentIds.includes(a.id));
    if (myAgents.length === 0) {
      alert("You need to compile at least one custom AI Agent first before you can run promotional campaigns.");
      return;
    }

    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      // Run subscriber simulated discovery
      const randomAgent = myAgents[Math.floor(Math.random() * myAgents.length)];
      const subscriptionFee = randomAgent.price ?? 5.99;
      const commissionEarned = parseFloat((subscriptionFee * ((randomAgent.commissionRate ?? 70) / 100)).toFixed(2));
      const subscriberNames = ["Sophia Chen", "Marcus Aurelius", "John Doe", "Liam Vance", "Fatima Al-Sayeh", "Emma Watson", "Ravi Patel", "Sarah Jenkins", "Oliver Twist", "Amara Okafor"];
      const subscriber = subscriberNames[Math.floor(Math.random() * subscriberNames.length)];

      const newTx = {
        id: `promo-tx-${Date.now()}`,
        agentId: randomAgent.id,
        agentName: randomAgent.name,
        type: "builder_commission",
        amount: commissionEarned,
        timestamp: new Date().toISOString(),
        subscriberName: subscriber
      };

      setTransactions(prev => [newTx, ...prev]);
      setUserState(prev => ({
        ...prev,
        balance: parseFloat((prev.balance + commissionEarned).toFixed(2)),
        subscribersToMyAgents: prev.subscribersToMyAgents + 1
      }));

      setShowNotification({
        message: `📣 Campaign Succeeded!`,
        subText: `Your marketing run succeeded. ${subscriber} subscribed to "${randomAgent.name}", earning you a $${commissionEarned.toFixed(2)} split.`
      });
    }, 1500);
  };
  
  // Custom workspace generator state
  const [problemInput, setProblemInput] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [buildLogs, setBuildLogs] = useState([]);
  
  // Active Agent details/playground
  const [activeAgent, setActiveAgent] = useState(() => {
    // Default workspace agent is the first preloaded productivity tool
    return INITIAL_AGENTS[0];
  });

  // Active workspace chat box state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isQueryingAgent, setIsQueryingAgent] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const chatBottomRef = useRef(null);

  // Modals and creator overlays
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(null);
  const [editingSystemPrompt, setEditingSystemPrompt] = useState(false);
  const [editableSettings, setEditableSettings] = useState({
    name: "",
    description: "",
    customInstructions: "",
    promptTemplate: "",
    price: 4.99
  });

  // Keep track of solved requested ideas
  const [targetedIdeaToSolve, setTargetedIdeaToSolve] = useState(null);

  // --- Sync storage changes ---
  useEffect(() => {
    localStorage.setItem("ai_workspace_agents", JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem("ai_workspace_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("ai_workspace_subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem("ai_workspace_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("ai_workspace_user", JSON.stringify(userState));
  }, [userState]);

  // Sync edited details when activeAgent changes
  useEffect(() => {
    if (activeAgent) {
      setEditableSettings({
        name: activeAgent.name,
        description: activeAgent.description,
        customInstructions: activeAgent.customInstructions,
        promptTemplate: activeAgent.promptTemplate,
        price: activeAgent.price
      });
      // Load starter message or empty chat
      setChatMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          text: `👋 Greetings! I have been compiled specifically to solve your problem: **"${activeAgent.description}"**\n\nTo try me out, click on the starting prompt template below or type your queries directly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  }, [activeAgent]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isQueryingAgent]);

  // Autoclose notification banner after 6 seconds
  useEffect(() => {
    if (showNotification) {
      const t = setTimeout(() => setShowNotification(null), 6000);
      return () => clearTimeout(t);
    }
  }, [showNotification]);

  // --- Functional Action Handlers ---

  // Generate agent via Server API
  const handleGenerateAgent = async (e) => {
    e.preventDefault();
    if (!problemInput.trim() || problemInput.trim().length < 5) {
      alert("Please enter a more descriptive problem definition (at least 5 characters).");
      return;
    }

    setIsBuilding(true);
    setBuildStep(0);
    setBuildLogs([]);

    // Progress logs simulation
    const steps = [
      "Analyzing user problem statement core factors...",
      "Matching industry categories and workflow taxonomy...",
      "Structuring deep System Instruction schemas...",
      "Writing prompt templates and custom action boundaries...",
      "Compiling final solution and subscription price brackets..."
    ];

    let currentStep = 0;
    const intervalTimer = setInterval(() => {
      if (currentStep < steps.length) {
        setBuildLogs(prev => [...prev, `[Ready] ${steps[currentStep]}`]);
        setBuildStep(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(intervalTimer);
      }
    }, 1200);

    try {
      const response = await fetch("/api/generate-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: problemInput,
          authorName: userState.name,
          customPrice: targetedIdeaToSolve ? targetedIdeaToSolve.priceBudget : 5.99
        })
      });

      const data = await response.json();
      clearInterval(intervalTimer);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to structure specialized solution.");
      }

      const generated = {
        ...data.agent,
        id: `agent-gen-${Date.now()}`,
        price: data.agent.price || data.agent.suggestedPrice || 5.99,
        isPremium: true,
        author: `${userState.name} (${userState.email})`,
        authorEmail: userState.email,
        subscribers: 0,
        rating: 5.0,
        category: "Productivity",
        isUserCreated: true,
        commissionRate: targetedIdeaToSolve ? 40 : 70, // Sharing with idea suggestor if matched
        ideaAuthorEmail: targetedIdeaToSolve ? targetedIdeaToSolve.suggestedByEmail : undefined,
        ideaAuthorCommission: targetedIdeaToSolve ? 30 : undefined,
        createdAt: new Date().toISOString()
      };

      // If built specifically from a community idea, update that request's status to completed
      let totalEarning = 0;
      let totalSubscribers = 0;
      const launchTxs = [];

      if (targetedIdeaToSolve) {
        setRequests(prev =>
          prev.map(r =>
            r.id === targetedIdeaToSolve.id
              ? { ...r, status: "completed", builtAgentId: generated.id }
              : r
          )
        );

        // Earn developer solution bounty! (e.g. pricing budget * 5)
        const bounty = parseFloat(((targetedIdeaToSolve.priceBudget ?? 4.99) * 5).toFixed(2));
        totalEarning += bounty;
        launchTxs.push({
          id: `fulfill-tx-${Date.now()}`,
          agentId: generated.id,
          agentName: generated.name,
          type: "builder_commission",
          amount: bounty,
          timestamp: new Date().toISOString(),
          subscriberName: `${targetedIdeaToSolve.suggestedByName} (Contract Award)`
        });

        // Immediate subscriber adoptions by community backers
        const backerCount = Math.floor(Math.random() * 2) + 3; // 3 to 4 backers
        totalSubscribers += backerCount;
        const potentialSubscribers = ["Sophia Chen", "Ben Miller", "Alexander K.", "Steve Vance", "Sarah Chen", "Marcus Aurelius", "Emma Watson"];
        for (let i = 0; i < backerCount; i++) {
          const subscriber = potentialSubscribers[i % potentialSubscribers.length];
          const authorCut = generated.commissionRate || 70;
          const commission = parseFloat(((generated.price ?? 5.99) * (authorCut / 100)).toFixed(2));
          totalEarning += commission;
          launchTxs.push({
            id: `backer-tx-${i}-${Date.now()}`,
            agentId: generated.id,
            agentName: generated.name,
            type: "builder_commission",
            amount: commission,
            timestamp: new Date().toISOString(),
            subscriberName: subscriber
          });
        }
      } else {
        // Regular custom-designed AI workspace compiler launch
        // 1 early organic subscriber subscribes immediately at launch!
        const authorCut = generated.commissionRate || 70;
        const commission = parseFloat(((generated.price ?? 5.99) * (authorCut / 100)).toFixed(2));
        totalEarning += commission;
        totalSubscribers += 1;
        launchTxs.push({
          id: `launch-organic-tx-${Date.now()}`,
          agentId: generated.id,
          agentName: generated.name,
          type: "builder_commission",
          amount: commission,
          timestamp: new Date().toISOString(),
          subscriberName: "Early Beta Customer"
        });
      }

      setAgents(prev => [generated, ...prev]);
      setActiveAgent(generated);
      if (launchTxs.length > 0) {
        setTransactions(prev => [...launchTxs, ...prev]);
      }

      setUserState(prev => ({
        ...prev,
        myCreatedAgentIds: [...prev.myCreatedAgentIds, generated.id],
        subscribedAgentIds: [...prev.subscribedAgentIds, generated.id], // Auto-subscribed to own agent
        balance: parseFloat((prev.balance + totalEarning).toFixed(2)),
        subscribersToMyAgents: prev.subscribersToMyAgents + totalSubscribers
      }));

      // Reset build states
      setProblemInput("");
      setTargetedIdeaToSolve(null);
      setBuildLogs(prev => [...prev, "✨ Success! Tailored AI Workspace is fully compiled."]);
      
      setTimeout(() => {
        setIsBuilding(false);
        setActiveTab("workspace");
        setShowNotification({
          message: `🛠️ Solution Constructed Successfully!`,
          subText: `Your new specialized AI "${generated.name}" is online. Try asking it questions in the workspace sandbox.`
        });
      }, 1000);

    } catch (err) {
      clearInterval(intervalTimer);
      setIsBuilding(false);
      alert(`AI compilation failed: ${err.message || err}`);
    }
  };

  // Run structured agent queries via Server API
  const handleQueryAgent = async (queryText = chatInput) => {
    if (!queryText.trim() || !activeAgent) return;

    // Append user message
    const pendedMessages = [...chatMessages];
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    
    const updatedMessages = [...pendedMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");
    setIsQueryingAgent(true);

    try {
      // Clean system instructions and message logs for Gemini api post
      const response = await fetch("/api/agent-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customInstructions: activeAgent.customInstructions,
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
          useSearch: useSearchGrounding
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "The custom AI Agent encountered an execution loop.");
      }

      const assistantMsg = {
        id: `msg-assistant-${Date.now()}`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.groundingSources && data.groundingSources.length > 0 ? data.groundingSources : undefined
      };

      setChatMessages(prev => [...prev, assistantMsg]);

      // Telemetry active usage trigger: testing in the sandbox has a chance to attract a simulated subscriber organically!
      const isMyBuiltAgent = activeAgent.isUserCreated || userState.myCreatedAgentIds.includes(activeAgent.id);
      if (isMyBuiltAgent && Math.random() < 0.45) {
        const authorCut = activeAgent.commissionRate || 70;
        const commissionEarned = parseFloat(((activeAgent.price ?? 5.99) * (authorCut / 100)).toFixed(2));
        const organicSubscribers = ["Sophia Chen", "Marcus Aurelius", "Liam Vance", "Fatima Al-Sayeh", "Emma Watson", "Ravi Patel", "Diana Prince", "Chidi Anagonye", "Yuki Tanaka"];
        const subscriber = organicSubscribers[Math.floor(Math.random() * organicSubscribers.length)];

        const newTx = {
          id: `query-sub-${Date.now()}`,
          agentId: activeAgent.id,
          agentName: activeAgent.name,
          type: "builder_commission",
          amount: commissionEarned,
          timestamp: new Date().toISOString(),
          subscriberName: subscriber
        };

        setTransactions(prev => [newTx, ...prev]);
        setUserState(prev => ({
          ...prev,
          balance: parseFloat((prev.balance + commissionEarned).toFixed(2)),
          subscribersToMyAgents: prev.subscribersToMyAgents + 1
        }));

        setShowNotification({
          message: `📈 New Organic Subscriber!`,
          subText: `${subscriber} subscribed to "${activeAgent.name}" because of active sandbox telemetry execution! You earned $${commissionEarned.toFixed(2)}.`
        });
      }

    } catch (err) {
      const errorMsg = {
        id: `msg-error-${Date.now()}`,
        role: "assistant",
        text: `⚠️ **Workspace Operational Fault**\n\n${err.message || "Failed to capture response from the AI Agent core. Please ensure your Gemini API configuration is functional."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsQueryingAgent(false);
    }
  };

  // Simulated Library subscription purchase
  const handleSubscribeToAgent = (agentId) => {
    const targetAgent = agents.find(a => a.id === agentId);
    if (!targetAgent) return;

    // Double check if already subscribed
    if (userState.subscribedAgentIds.includes(agentId)) {
      alert("You are already subscribed to this AI Solution.");
      return;
    }

    // Purchase validation
    const confirms = window.confirm(
      `Subscribe to "${targetAgent.name}" by ${targetAgent.author} for $${(targetAgent.price ?? 5.99).toFixed(2)}/mo?\n\n(This will charge your dashboard and simulate live usage payouts).`
    );

    if (confirms) {
      // Record subscription
      const newSub = {
        agentId,
        subscribedAt: new Date().toISOString().split("T")[0],
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        price: targetAgent.price ?? 5.99
      };

      setSubscriptions(prev => [...prev, newSub]);
      setUserState(prev => ({
        ...prev,
        subscribedAgentIds: [...prev.subscribedAgentIds, agentId]
      }));

      // Simulate reward pay to developers
      const authorCut = targetAgent.isUserCreated ? 100 : targetAgent.commissionRate || 70;
      const earningsValue = parseFloat(((targetAgent.price ?? 5.99) * (authorCut / 100)).toFixed(2));

      // Increase subscription count of that agent
      setAgents(prev =>
        prev.map(a => (a.id === agentId ? { ...a, subscribers: a.subscribers + 1 } : a))
      );

      setShowNotification({
        message: `✅ Subscribed Successfully!`,
        subText: `You unlocked "${targetAgent.name}". Go back to your Workspace Hub to load and interact with it.`
      });
    }
  };

  // Submit new requested problem
  const handleCreateRequest = (title, desc, pricingBudget) => {
    const newRequest = {
      id: `req-gen-${Date.now()}`,
      title,
      problemDescription: desc,
      suggestedByEmail: userState.email,
      suggestedByName: userState.name,
      status: "open",
      priceBudget: pricingBudget,
      subscribersInterestsCount: 1 // started with 1 backing interest from author
    };

    setRequests(prev => [newRequest, ...prev]);
    setIsIdeaModalOpen(false);
    setShowNotification({
      message: `💡 Idea Pitch Published!`,
      subText: `Your request "${title}" is now listed in the community library boards. Other users can develop custom software for you.`
    });
  };

  // Upvote standard request
  const handleUpvoteIdea = (ideaId) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === ideaId
          ? { ...r, subscribersInterestsCount: r.subscribersInterestsCount + 1 }
          : r
      )
    );
  };

  // Trigger developer builder workspace pre-filled with values from a requested problem
  const handleSelectDevelopIdea = (idea) => {
    setTargetedIdeaToSolve(idea);
    setProblemInput(idea.problemDescription);
    setActiveTab("workspace");
    setShowNotification({
      message: `🛠️ Developing Custom Solution`,
      subText: `Generative workspace has been locked onto target: "${idea.title}". Simply click "Design My Custom AI Solution".`
    });
  };

  // Trigger agent configuration alterations
  const handleUpdateAgentSettings = (e) => {
    e.preventDefault();
    if (!activeAgent) return;

    setAgents(prev =>
      prev.map(a =>
        a.id === activeAgent.id
          ? {
              ...a,
              name: editableSettings.name,
              description: editableSettings.description,
              customInstructions: editableSettings.customInstructions,
              promptTemplate: editableSettings.promptTemplate,
              price: editableSettings.price
            }
          : a
      )
    );

    setActiveAgent(prev =>
      prev
        ? {
            ...prev,
            name: editableSettings.name,
            description: editableSettings.description,
            customInstructions: editableSettings.customInstructions,
            promptTemplate: editableSettings.promptTemplate,
            price: editableSettings.price
          }
        : null
    );

    setEditingSystemPrompt(false);
    setShowNotification({
      message: `⚙️ Settings Updated`,
      subText: `Custom agent workspace parameters and prompt modifiers saved successfully.`
    });
  };

  // Filter products and help wanted request cards in library
  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === "All Categories" || agent.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !librarySearch.trim() || 
      agent.name.toLowerCase().includes(librarySearch.toLowerCase()) || 
      agent.description.toLowerCase().includes(librarySearch.toLowerCase()) ||
      agent.customInstructions.toLowerCase().includes(librarySearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = !librarySearch.trim() ||
      req.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      req.problemDescription.toLowerCase().includes(librarySearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col justify-between overflow-hidden">
      
      {/* Top Static Alert/Notification HUD */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-slide-up">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <LucideIcon name="Flame" size={20} className="text-indigo-600 fill-indigo-200" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">{showNotification.message}</h4>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{showNotification.subText}</p>
            </div>
            <button
              onClick={() => setShowNotification(null)}
              className="text-gray-300 hover:text-gray-600 transition p-1"
            >
              <LucideIcon name="X" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Primary Container App */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-screen">
        
        {/* Navigation Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Make It AI</span>
          </div>

          {/* Tab Selection Navigation */}
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("workspace")}
              className={`text-sm font-semibold transition-colors cursor-pointer ${activeTab === "workspace" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "text-slate-505 hover:text-slate-800"}`}
            >
              Engine
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`text-sm font-semibold transition-colors cursor-pointer ${activeTab === "library" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "text-slate-505 hover:text-slate-800"}`}
            >
              Library
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`text-sm font-semibold transition-colors cursor-pointer ${activeTab === "wallet" ? "text-indigo-600 border-b-2 border-indigo-600 pb-1" : "text-slate-505 hover:text-slate-800"}`}
            >
              Revenue
            </button>
          </nav>

          {/* User Badge Overview & Simulated Earnings */}
          <div className="flex items-center gap-4">
            {!userState.isLogged ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm transition-all"
              >
                Developer Sign In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Enterprise indicator */}
                <div className="hidden sm:block text-right border-r pr-3 border-slate-200">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-404">Account Tier</p>
                  {userState.hasEnterpriseSubscription ? (
                    <button
                      onClick={() => setIsEnterpriseModalOpen(true)}
                      className="text-amber-600 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      👑 Enterprise ($2K/mo)
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEnterpriseModalOpen(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      👑 Upgrade to Enterprise
                    </button>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Current Earnings</p>
                  <p className="text-sm font-bold text-emerald-600 relative inline-flex items-center">
                    ${(userState.balance ?? 0).toFixed(2)}
                    {(userState.balance ?? 0) > 5.49 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse ml-1 shrink-0" />
                    )}
                  </p>
                </div>

                {/* Avatar with click-to-logout tooltip */}
                <div 
                  onClick={() => {
                    if (confirm("Would you like to log out of your current sandboxed developer profile?")) {
                      setUserState(prev => ({ ...prev, isLogged: false }));
                    }
                  }}
                  title="Click to Log Out of session"
                  className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                >
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-indigo-50">
                    {userState.name ? userState.name.split(" ").map(n => n[0]).join("") : "JD"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Core Content Box Panels */}
        <main className="flex-1 p-6">
          
          {/* ==================================== */}
          {/* VIEW: WORKSPACE HUB */}
          {/* ==================================== */}
          {activeTab === "workspace" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* LEFT SIDEBAR: GENERATOR COCKPIT & ACTIVE AGENT DETAILS */}
              <div className="xl:col-span-4 space-y-6">
                
                {/* 1. Build a New Custom Solution Input */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">What challenge can we solve today?</h2>
                    <p className="text-xs text-slate-500">Describe your problem in detail. Make It AI will architect, train, and deploy a custom neural solution specifically for your workflow.</p>
                  </div>

                  {targetedIdeaToSolve && (
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-900">
                      <div className="flex justify-between items-start gap-1">
                        <span>
                          <strong>Targeting concept:</strong> Solving "<em>{targetedIdeaToSolve.title}</em>" for a split-revenue royalty.
                        </span>
                        <button
                          onClick={() => {
                            setTargetedIdeaToSolve(null);
                            setProblemInput("");
                          }}
                          className="text-indigo-400 hover:text-indigo-800 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleGenerateAgent} className="relative">
                    <textarea
                      required
                      placeholder="Example: I need a tool that analyzes 10 different research sources and creates a synthesized summary of conflicting data points..."
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-404 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isBuilding}
                      className="absolute bottom-4 right-4 bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-md transition-colors text-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <LucideIcon name="Zap" size={12} />
                      {isBuilding ? "Initializing Build..." : "Initialize Build"}
                    </button>
                  </form>
                </div>

                {/* Loading/Analysing Animation Container */}
                {isBuilding && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      <h3 className="text-xs font-bold text-gray-900">Structuring Solution Architecture...</h3>
                    </div>
                    
                    {/* Animated Progress Logs */}
                    <div className="rounded-xl bg-slate-900 p-4 font-mono text-[10px] text-gray-300 space-y-1.5">
                      {buildLogs.map((log, index) => (
                        <div key={index} className="text-green-400">{log}</div>
                      ))}
                      <div className="text-slate-505 animate-pulse">▋ Waiting for deep system instructions compilation...</div>
                    </div>
                  </div>
                )}

                {/* Active Architectures Feed (Dynamic list of user's active/subscribed solutions) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Architectures</h2>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{userState.subscribedAgentIds.length} Total</span>
                  </div>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {agents.filter(a => userState.subscribedAgentIds.includes(a.id)).map(ag => {
                      const isActive = activeAgent?.id === ag.id;
                      return (
                        <div
                          key={ag.id}
                          onClick={() => setActiveAgent(ag)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isActive ? "bg-indigo-50 border-indigo-150" : "bg-white border-slate-100 hover:border-slate-300"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${isActive ? "bg-white border-indigo-200 text-indigo-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                              <LucideIcon name={ag.iconName} size={18} />
                            </div>
                            <div className="min-w-0">
                              <h3 className={`font-bold text-xs truncate ${isActive ? "text-slate-905" : "text-slate-700"}`}>{ag.name}</h3>
                              <p className="text-[10px] text-slate-400 truncate">Stage: {isActive ? "Optimization" : "Live"}</p>
                            </div>
                          </div>
                          {isActive ? (
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
                              <div className="w-3/4 h-full bg-indigo-500" />
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-full uppercase shrink-0">Live</span>
                          )}
                        </div>
                      );
                    })}

                    {agents.filter(a => userState.subscribedAgentIds.includes(a.id)).length === 0 && (
                      <p className="text-center text-xs text-slate-400 py-6">No active solutions. Go to the Library to lock some onto active state parameters.</p>
                    )}
                  </div>
                </div>

                {/* 2. Loaded Custom Agent Workspace Stats */}
                {activeAgent && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative">
                    {/* Dynamic Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                          <LucideIcon name={activeAgent.iconName} className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 truncate max-w-[150px]" title={activeAgent.name}>
                            {activeAgent.name}
                          </h3>
                          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600 font-mono">
                            {activeAgent.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">Monthly Sub</p>
                        <p className="text-sm font-bold font-mono text-indigo-650">
                          {(activeAgent.price ?? 0) === 0 ? "Free" : `$${(activeAgent.price ?? 5.99).toFixed(2)}`}
                        </p>
                      </div>
                    </div>

                    <p className="mb-5 text-xs text-gray-500 leading-relaxed border-t border-slate-100 pt-3">
                      {activeAgent.description}
                    </p>

                    {/* Operational Settings toggle edit rules */}
                    {!editingSystemPrompt ? (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] leading-snug">
                          <p className="font-bold text-gray-700 uppercase tracking-wide text-[9px] mb-1">
                            Core AI Strategy Parameters
                          </p>
                          <p className="text-gray-500 line-clamp-3 italic">
                            {activeAgent.customInstructions}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400 font-mono border-t border-slate-100 pt-3">
                          <span>Developer</span>
                          <span className="text-gray-705 truncate max-w-[160px]">{activeAgent.author}</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setEditingSystemPrompt(true)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-slate-50 transition"
                          >
                            <LucideIcon name="Settings" size={12} />
                            Adjust Agent Prompt
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateAgentSettings} className="space-y-4 pt-3 border-t border-slate-200">
                        <h4 className="text-xs font-bold text-gray-800">Workspace Prompt & Modifiers Settings</h4>
                        
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Memorable Agent Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editableSettings.name}
                            onChange={(e) => setEditableSettings({ ...editableSettings, name: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-300 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Custom System Prompt Rules
                          </label>
                          <textarea
                            rows={5}
                            required
                            value={editableSettings.customInstructions}
                            onChange={(e) => setEditableSettings({ ...editableSettings, customInstructions: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-300 focus:bg-white resize-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Starter Template Prompt
                          </label>
                          <input
                            type="text"
                            required
                            value={editableSettings.promptTemplate}
                            onChange={(e) => setEditableSettings({ ...editableSettings, promptTemplate: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-300 focus:bg-white"
                          />
                        </div>

                        {/* Adjust monthly fee */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            <span>Adjust Subscription License Price</span>
                            <span className="font-mono text-xs font-bold text-indigo-700">${(editableSettings.price ?? 4.99).toFixed(2)}/mo</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="19.99"
                            step="0.50"
                            value={editableSettings.price}
                            onChange={(e) => setEditableSettings({ ...editableSettings, price: parseFloat(e.target.value) })}
                            className="h-1 cursor-pointer w-full appearance-none rounded-lg bg-slate-150 accent-indigo-600"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingSystemPrompt(false)}
                            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-gray-500 hover:bg-slate-50"
                          >
                            Discard
                          </button>
                          <button
                            type="submit"
                            className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Save Settings
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

               {/* RIGHT MAIN PANEL: INTERACTIVE AGENT CHAT SANDBOX */}
              <div className="xl:col-span-8">
                {activeAgent ? (
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[680px] overflow-hidden">
                    {activeAgent.interfaceType === "clothing-fitter" || activeAgent.id === "agent-clothes-tryon" ? (
                      <ClothingFitterWorkspace
                        agent={activeAgent}
                        isQuerying={isQueryingAgent}
                        onQuerySubmit={(q) => handleQueryAgent(q)}
                        chatMessages={chatMessages}
                      />
                    ) : activeAgent.interfaceType === "marketing-catalyst" || activeAgent.id === "agent-multilingual-blog" ? (
                      <MarketingWorkspace
                        agent={activeAgent}
                        isQuerying={isQueryingAgent}
                        onQuerySubmit={(q) => handleQueryAgent(q)}
                        chatMessages={chatMessages}
                      />
                    ) : activeAgent.interfaceType === "data-analyzer" || activeAgent.id === "agent-contract-analyzer" ? (
                      <DataAnalyzerWorkspace
                        agent={activeAgent}
                        isQuerying={isQueryingAgent}
                        onQuerySubmit={(q) => handleQueryAgent(q)}
                        chatMessages={chatMessages}
                      />
                    ) : (
                      <>
                        {/* Chat Box Header info */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <h3 className="text-sm font-bold text-gray-805">
                                Custom Sandbox: {activeAgent.name}
                              </h3>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Interacting directly inside the specialized system instruction layers.
                            </p>
                          </div>

                          {/* Google Search Grounding toggle option */}
                          <button
                            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${useSearchGrounding ? "bg-indigo-50 border-indigo-150 text-indigo-700" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                            title="Enables high-performance Google Search tools to pull real-time web citations"
                          >
                            <LucideIcon name="Globe" size={12} />
                            Web Grounding: {useSearchGrounding ? "ON" : "OFF"}
                          </button>
                        </div>

                        {/* Chat Logs Window Panel */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 font-sans">
                          {chatMessages.map((msg, index) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-fade-in"}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-2xl px-5 py-4 text-xs leading-relaxed shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"}`}
                              >
                                {/* Message Render content */}
                                <div className="whitespace-pre-wrap select-text selection:bg-indigo-200">
                                  {/* Simple Markdown Bold/Bullet rendering */}
                                  {msg.text.split("\n").map((line, i) => {
                                    if (line.startsWith("### ")) {
                                      return <h4 key={i} className="text-sm font-bold mt-3 mb-1 text-slate-900">{line.replace("### ", "")}</h4>;
                                    }
                                    if (line.startsWith("- ")) {
                                      return <li key={i} className="ml-4 list-disc my-0.5 text-slate-705">{line.replace("- ", "")}</li>;
                                    }
                                    if (line.match(/^\d+\./)) {
                                      return <li key={i} className="ml-4 list-decimal my-0.5 text-slate-705">{line}</li>;
                                    }
                                    if (line.startsWith("**") && line.endsWith("**")) {
                                      return <strong key={i} className="block font-bold mt-2 text-slate-900">{line.replace(/\*\*/g, "")}</strong>;
                                    }
                                    return <p key={i} className="my-1">{line}</p>;
                                  })}
                                </div>

                                {/* Dynamic citations showing ground results */}
                                {msg.sources && msg.sources.length > 0 && (
                                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 inline-flex items-center gap-1">
                                      <LucideIcon name="Server" size={10} />
                                      Grounded Web Citations
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                      {msg.sources.map((src, i) => (
                                        <a
                                          key={i}
                                          href={src.uri}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-indigo-600 hover:text-indigo-900 border border-slate-200"
                                        >
                                          <LucideIcon name="Globe" size={8} />
                                          {src.title}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <span className={`block text-[9px] mt-2 text-right ${msg.role === "user" ? "text-indigo-200 font-mono" : "text-slate-404 font-mono"}`}>
                                  {msg.timestamp}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* Loading/Querying Bubble */}
                          {isQueryingAgent && (
                            <div className="flex justify-start animate-pulse">
                              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-4 space-y-2 shadow-sm">
                                <span className="text-[10px] font-bold text-indigo-505 flex items-center gap-1.5 font-mono">
                                  <span className="h-1.5 w-1.5 bg-indigo-505 rounded-full animate-bounce" />
                                  Scanning knowledge indexes...
                                </span>
                                <div className="h-2.5 w-48 bg-slate-100 rounded" />
                                <div className="h-2.5 w-32 bg-slate-100 rounded" />
                              </div>
                            </div>
                          )}

                          <div ref={chatBottomRef} />
                        </div>

                        {/* Chat templates & input block */}
                        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                          
                          {/* Anchor starter key prompt suggestions */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                            <span className="text-[10px] uppercase font-bold text-slate-404 shrink-0 inline-flex items-center gap-1">
                              <LucideIcon name="Compass" size={10} />
                              Starter Prompt Template:
                            </span>
                            <button
                              onClick={() => {
                                setChatInput(activeAgent.promptTemplate);
                                handleQueryAgent(activeAgent.promptTemplate);
                              }}
                              className="shrink-0 max-w-[340px] text-left truncate rounded-lg border border-indigo-100 hover:border-indigo-250 bg-indigo-50/20 hover:bg-indigo-50 px-2.5 py-1 text-[11px] text-slate-700 font-medium transition"
                            >
                              "{activeAgent.promptTemplate}"
                            </button>
                          </div>

                          {/* Input Actions form */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={`Ask ${activeAgent.name}...`}
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleQueryAgent()}
                              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-indigo-505 focus:bg-white focus:ring-1 focus:ring-indigo-100 transition"
                            />
                            <button
                              onClick={() => handleQueryAgent()}
                              disabled={isQueryingAgent || !chatInput.trim()}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                              <LucideIcon name="MessageSquare" size={16} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center h-[500px] flex flex-col items-center justify-center animate-fade-in">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                      <LucideIcon name="Sparkles" size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">No Loaded Custom Solution</h3>
                    <p className="max-w-md text-slate-400 text-xs mb-6">
                      Describe your problem on the left sidebar to generate a specialized workplace, or browse pre-built AI apps in the Solutions Library storefront.
                    </p>
                    <button
                      onClick={() => setActiveTab("library")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                    >
                      Browse Solutions Library
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* VIEW: SOLUTIONS LIBRARY */}
          {/* ==================================== */}
          {activeTab === "library" && (
            <div className="space-y-6">
              
              {/* Library HUD Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white px-8 py-6 rounded-2xl border shadow-sm">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Community Solutions Directory</h2>
                  <p className="text-xs text-slate-500 mt-1">Explore problem-solving AI apps designed by our team or contributed by other developers.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full xl:w-auto">
                  {/* Dynamic Search Input Bar */}
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      placeholder="Search active apps or requested ideas..."
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      className="w-full text-xs pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                    />
                    <div className="absolute left-2.5 top-3.5 text-slate-400">
                      <LucideIcon name="Search" size={12} />
                    </div>
                    {librarySearch && (
                      <button
                        onClick={() => setLibrarySearch("")}
                        className="absolute right-2.5 top-2.5 hover:bg-slate-200 rounded p-1 text-slate-400 hover:text-slate-600 font-bold text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setLibrarySubTab("store")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${librarySubTab === "store" ? "bg-indigo-50 text-indigo-805 border-indigo-200 border" : "bg-slate-50 text-slate-505 border border-slate-150 hover:text-slate-900"}`}
                    >
                      🚀 Active Solution Apps ({filteredAgents.length})
                    </button>
                    <button
                      onClick={() => setLibrarySubTab("requests")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${librarySubTab === "requests" ? "bg-amber-50 text-amber-805 border-amber-200 border" : "bg-slate-50 text-slate-505 border border-slate-150 hover:text-slate-900"}`}
                    >
                      💡 Help Wanted ({filteredRequests.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* STOREFRONT APP TILES */}
              {librarySubTab === "store" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Category filters */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-404 mr-2">
                      Frictions Category
                    </span>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${selectedCategory === cat ? "bg-indigo-650 border-indigo-650 text-white" : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map(ag => {
                      const isSubscribed = userState.subscribedAgentIds.includes(ag.id);
                      const isOwner = ag.authorEmail === userState.email || userState.myCreatedAgentIds.includes(ag.id);
                      return (
                        <AgentCard
                          key={ag.id}
                          agent={ag}
                          isSubscribed={isSubscribed}
                          isOwner={isOwner}
                          onSubscribe={handleSubscribeToAgent}
                          onLaunch={(activated) => {
                            setActiveAgent(activated);
                            setActiveTab("workspace");
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* REQUEST BOARDS */}
              {librarySubTab === "requests" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Explainer card */}
                  <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-slate-800">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1 bg-indigo-900 rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-indigo-200">
                        Commission Opportunity
                      </div>
                      <h3 className="text-base font-bold text-white">Help Wanted Idea Board</h3>
                      <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
                        These are real workflow problems raised by our community lacking an elegant solution. Build a custom AI Agent to solve any problem below. <strong>If built, the requester pays and splits subscription commissions (30% to requester, 40% to you, and 30% platform)!</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setIsIdeaModalOpen(true)}
                      className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-amber-500 px-5 py-3 text-xs font-bold text-gray-900 hover:bg-amber-400 select-none cursor-pointer transition shadow-md"
                    >
                      <LucideIcon name="Brain" size={14} />
                      Request a Problem Solution
                    </button>
                  </div>

                  {/* Requests list grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map(req => {
                      const isCurrentUserTheSuggester = req.suggestedByEmail === userState.email;
                      return (
                        <IdeaRequestCard
                          key={req.id}
                          idea={req}
                          isCurrentUserTheSuggester={isCurrentUserTheSuggester}
                          onUpvote={handleUpvoteIdea}
                          onSelectDevelop={handleSelectDevelopIdea}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* VIEW: WALLET & COMMISSIONS */}
          {/* ==================================== */}
          {activeTab === "wallet" && (
            <div className="space-y-6 items-start gap-6 animate-fade-in">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Earnings balance */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[160px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Developer Balance (Passive Commissions)
                    </span>
                    <p className="text-3xl font-bold font-mono text-slate-900 mt-2">
                      ${(userState.balance ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
                    {userState.stripeConnected ? (
                      <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-555" />
                        Connected to Bank Account
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setUserState(prev => ({ ...prev, stripeConnected: true }));
                          setShowNotification({
                            message: "Stripe Wallet successfully linked",
                            subText: "Your monthly withdraws are now direct-deposited to your bank."
                          });
                        }}
                        className="text-indigo-650 font-bold hover:underline cursor-pointer"
                      >
                        Setup Stripe Withdrawals
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Subscribers Count */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[160px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Paying Subscribers To your Solutions
                    </span>
                    <p className="text-3xl font-bold font-mono text-slate-900 mt-2">
                      {userState.subscribersToMyAgents}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    Generated across {agents.filter(a => a.isUserCreated || userState.myCreatedAgentIds.includes(a.id)).length} active custom library apps
                  </span>
                </div>

                {/* 3. My Subscriptions */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[160px]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Active Unlocked Solutions
                    </span>
                    <p className="text-3xl font-bold font-mono text-slate-900 mt-2">
                      {subscriptions.length}
                    </p>
                  </div>

                  <span className="text-xs text-slate-450">
                    Your monthly outgoing subscription cost: $
                    {subscriptions.reduce((acc, sub) => acc + (sub.price ?? 0), 0).toFixed(2)}/mo
                  </span>
                </div>
              </div>

              {/* Transactions list ledger */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Ledger Transactions */}
                <div className="lg:col-span-8 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Commission Earnings Statement</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-slate-400 font-bold">
                          <th className="pb-3 font-semibold text-slate-400">Date/Time</th>
                          <th className="pb-3 font-semibold text-slate-400">Solution Source</th>
                          <th className="pb-3 font-semibold text-slate-400">Commissions Type</th>
                          <th className="pb-3 font-semibold text-slate-400">Subscriber</th>
                          <th className="pb-3 font-semibold text-slate-450 text-right">Earning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-600">
                        {transactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-gray-50/50">
                            <td className="py-3 text-[10px]">
                              {new Date(tx.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </td>
                            <td className="py-3 font-semibold tabular-nums text-gray-808">
                              {tx.agentName}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase ${tx.type === "builder_commission" ? "bg-green-50 text-green-700" : "bg-indigo-50 text-indigo-700"}`}>
                                {tx.type === "builder_commission" ? "Dev Split" : "Idea Royalty"}
                              </span>
                            </td>
                            <td className="py-3 text-[11px]">{tx.subscriberName}</td>
                            <td className="py-3 font-bold text-emerald-600 text-right">
                              +${(tx.amount ?? 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Manage subscriptions details & promotional campaigns */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Organic Marketing Campaigns */}
                  <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 text-indigo-650 rounded-lg animate-pulse">
                        <LucideIcon name="Megaphone" size={16} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Organic Marketing Campaigns</h3>
                    </div>
                    <p className="text-[11px] text-slate-505 leading-relaxed">
                      Earning is action-oriented. Boost your custom agents' market presence with targeted developer promotions to sign up new subscribers!
                    </p>
                    
                    <button
                      onClick={handlePromoteMyAgents}
                      disabled={isPromoting}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      {isPromoting ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping inline-block mr-1" />
                          Running Campaign...
                        </>
                      ) : (
                        <>
                          <LucideIcon name="Compass" size={14} />
                          Boost Agent Market Prominence
                        </>
                      )}
                    </button>
                    
                    <p className="text-[10px] text-slate-400 text-center">
                      *Promote custom agents to active user subscriber pools.
                    </p>
                  </div>

                  {/* Active Licenses Subscribed To */}
                  <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Active Licenses Subscribed To</h3>
                    
                    <div className="space-y-3">
                      {subscriptions.map(sub => {
                        const age = agents.find(a => a.id === sub.agentId);
                        return (
                          <div key={sub.agentId} className="rounded-xl border border-slate-150 p-3.5 bg-slate-50/50 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{age?.name || "Premium AI Agent"}</p>
                              <p className="text-[10px] text-slate-405 font-mono mt-0.5">Renews on: {sub.renewalDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-slate-800">${(sub.price ?? 0).toFixed(2)}/mo</p>
                              <button
                                onClick={() => {
                                  setShowNotification({
                                    message: "Subscription Cancelled",
                                    subText: `You have successfully cancelled the subscription license for ${age?.name || "Premium Agency"}.`
                                  });
                                  setSubscriptions(prev => prev.filter(p => p.agentId !== sub.agentId));
                                  setUserState(prev => ({
                                    ...prev,
                                    subscribedAgentIds: prev.subscribedAgentIds.filter(id => id !== sub.agentId)
                                  }));
                                }}
                                className="text-[10px] text-red-500 hover:underline mt-1 font-semibold cursor-pointer"
                              >
                                Cancel license
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {subscriptions.length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-6">You have no active billing subscription licenses unlocked.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Suggest Problem concept ticket Modal */}
      <CreateIdeaModal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        onSubmit={handleCreateRequest}
        userEmail={userState.email}
      />

      {/* Sign-in / Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(email, name) => {
          setUserState(prev => ({
            ...prev,
            isLogged: true,
            email: email,
            name: name
          }));
          setShowNotification({
            message: "Login Successful",
            subText: `Welcome back, ${name}! Your sandboxed developer profile is now activated.`
          });
        }}
      />

      {/* Enterprise Subscription Modal ($2000 per month) */}
      <EnterpriseSubscriptionModal
        isOpen={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
        onSubscribeSuccess={() => {
          setUserState(prev => ({
            ...prev,
            hasEnterpriseSubscription: true
          }));
          setShowNotification({
            message: "Enterprise Activated",
            subText: "Congratulations! You have successfully subscribed to the $2,000/mo unrestricted enterprise tier. Unlocked specialized solvers and virtual fitting workspace."
          });
        }}
        onCancelSubscription={() => {
          setUserState(prev => ({
            ...prev,
            hasEnterpriseSubscription: false
          }));
          setShowNotification({
            message: "Enterprise Cancelled",
            subText: "Your enterprise billing subscription has been cancelled."
          });
        }}
        currentSubscriptionStatus={!!userState.hasEnterpriseSubscription}
      />
      
      {/* Dynamic Static Footer Info details */}
      <footer className="w-full text-center py-4 text-[10px] text-slate-400 font-mono border-t border-slate-200 bg-white">
        <span>© 2026 Make It AI Custom neural environments. Powered by Gemini & @google/genai. All payouts simulated in sandbox.</span>
      </footer>
    </div>
  );
}
