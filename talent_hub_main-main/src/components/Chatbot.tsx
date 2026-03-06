import { useState, useRef, useEffect } from "react";
import { BotMessageSquare, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveLead } from "@/lib1/saveLead";

type Message = {
    id: string;
    sender: "bot" | "user";
    text: string;
};

type ChatState =
    | "idle"
    | "chatting"
    | "ask_service"
    | "ask_description"
    | "ask_budget"
    | "ask_timeline"
    | "ask_email"
    | "finished";

const SERVICES = [
    "Website Development",
    "UI/UX Design",
    "Mobile App Development",
    "Branding & Graphic Design",
    "Digital Marketing",
    "AI & Automation Solutions",
    "Freelance Talent Hiring",
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "bot",
            text: "Hi! I'm genz. I'm here to help you understand our services and guide you to the right solution.",
        },
        {
            id: "2",
            sender: "bot",
            text: "RAWGENN connects businesses with elite verified freelancers and manages projects end-to-end. How can I help you today?",
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [chatState, setChatState] = useState<ChatState>("chatting");

    // Store form data internally
    const [formData, setFormData] = useState({
        service: "",
        description: "",
        budget: "",
        timeline: "",
        email: "",
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Use a slight timeout to ensure state and DOM have updated before scrolling
        const timeout = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages, chatState, isOpen]);

    const addMessage = (sender: "bot" | "user", text: string) => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), sender, text },
        ]);
    };

    const handleNextStep = (userInput: string) => {
        const lowerInput = userInput.toLowerCase();

        switch (chatState) {
            case "chatting":
                if (lowerInput.includes("service") || lowerInput.includes("what do you do") || lowerInput.includes("offer")) {
                    setTimeout(() => {
                        addMessage("bot", "We provide Website Development, UI/UX Design, Mobile App Development, Branding, Digital Marketing, AI & Automation, and Freelance Talent Hiring. Would you like to start a project?");
                    }, 600);
                } else if (lowerInput.includes("how") || lowerInput.includes("work")) {
                    setTimeout(() => {
                        addMessage("bot", "RAWGENN helps clients hire verified freelancers by matching you with the perfect talent and managing the project end-to-end to guarantee quality. Want to start a project?");
                    }, 600);
                } else if (lowerInput.includes("price") || lowerInput.includes("pricing") || lowerInput.includes("cost") || lowerInput.includes("much")) {
                    setTimeout(() => {
                        addMessage("bot", "In today's market, pricing varies widely based on scope. Simple websites might start around $500-$2,000, while complex apps or custom AI solutions can range from $5,000 to $20,000+. At RAWGENN, we match you with elite freelancers for competitive, transparent rates. Want to start a project and get a quote?");
                    }, 600);
                } else if (lowerInput.includes("world") || lowerInput.includes("today") || lowerInput.includes("nowadays") || lowerInput.includes("trend") || lowerInput.includes("ai")) {
                    setTimeout(() => {
                        addMessage("bot", "We live in a fast-paced era dominated by AI integrations, clean modern UI/UX, and highly scalable technologies. Today's businesses need intelligent automation and robust digital experiences to stay competitive. Would you like to see how we tackle modern challenges?");
                    }, 600);
                } else if (lowerInput.includes("start") || lowerInput.includes("project") || lowerInput.includes("hire") || lowerInput.includes("yes")) {
                    setChatState("ask_service");
                    setTimeout(() => addMessage("bot", "Awesome! What service are you looking for?"), 600);
                } else {
                    const fallbacks = [
                        "I'm not quite sure I caught that. I can help with RAWGENN's services, modern pricing, or start a new project for you!",
                        "Could you rephrase that? I'm genz, your RAWGENN assistant, ready to match you with top-tier freelancers.",
                        "Interesting! While I'm still learning, I'm best at discussing our specific UI/UX, development services, and project management. How can I help with those?",
                        "I didn't quite understand, but remember you can always tap the buttons above or ask about starting a project!",
                        "I might need a little more clarity. Are you looking to hire talent, check our prices, or understand our process?"
                    ];
                    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                    setTimeout(() => {
                        addMessage("bot", randomFallback);
                    }, 600);
                }
                break;
            case "ask_service":
                setFormData({ ...formData, service: userInput });
                setChatState("ask_description");
                setTimeout(() => addMessage("bot", "Great! Can you briefly describe your project?"), 600);
                break;
            case "ask_description":
                setFormData({ ...formData, description: userInput });
                setChatState("ask_budget");
                setTimeout(() => addMessage("bot", "Thanks. What is your estimated budget?"), 600);
                break;
            case "ask_budget":
                setFormData({ ...formData, budget: userInput });
                setChatState("ask_timeline");
                setTimeout(() => addMessage("bot", "Got it. What is your expected timeline?"), 600);
                break;
            case "ask_timeline":
                setFormData({ ...formData, timeline: userInput });
                setChatState("ask_email");
                setTimeout(() => addMessage("bot", "Perfect. Lastly, what is your email address?"), 600);
                break;
            case "ask_email":
                const updatedData = { ...formData, email: userInput };
                setFormData(updatedData);
                setChatState("finished");

                setTimeout(async () => {
                    addMessage(
                        "bot",
                        "Thank you! I've received your project details. Someone from the RAWGENN team will contact you soon."
                    );

                    try {
                        await saveLead({
                            name: "Website Lead", // you can later collect name if needed
                            email: updatedData.email,
                            project: updatedData.description,
                            budget: updatedData.budget,
                            timeline: updatedData.timeline,
                        });

                        console.log("Lead saved to Supabase:", updatedData);
                    } catch (error) {
                        console.error("Error saving lead:", error);
                    }
                }, 800);

                break;
            default:
                break;
        }
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        addMessage("user", inputValue.trim());
        handleNextStep(inputValue.trim());
        setInputValue("");
    };

    const handleActionClick = (text: string) => {
        addMessage("user", text);
        handleNextStep(text);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-transform hover:scale-105"
                    >
                        <BotMessageSquare className="h-6 w-6" />
                    </Button>
                )}

                {isOpen && (
                    <div className="bg-white dark:bg-background border border-border shadow-2xl rounded-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                        {/* Header */}
                        <div className="bg-primary px-4 py-3 flex items-center justify-between text-primary-foreground">
                            <div className="flex items-center gap-2">
                                <BotMessageSquare className="h-5 w-5" />
                                <div className="font-semibold">genz</div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary-foreground hover:bg-primary/80 hover:text-white rounded-full"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[80%] shadow-sm rounded-2xl px-4 py-2 text-sm ${msg.sender === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-white dark:bg-muted text-foreground rounded-tl-sm border border-border"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {/* Quick actions when chatting and no user messages yet */}
                                {chatState === "chatting" && messages.filter(m => m.sender === "user").length === 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs rounded-full border-primary/20 hover:border-primary/50"
                                            onClick={() => handleActionClick("What are your services?")}
                                        >
                                            Our Services
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs rounded-full border-primary/20 hover:border-primary/50"
                                            onClick={() => handleActionClick("How does it work?")}
                                        >
                                            How it Works
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs rounded-full border-primary/20 hover:border-primary/50"
                                            onClick={() => handleActionClick("What are normal prices?")}
                                        >
                                            Pricing Today
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs rounded-full border-primary/20 hover:border-primary/50"
                                            onClick={() => handleActionClick("Tell me about today's tech world")}
                                        >
                                            Modern Trends
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="text-xs rounded-full"
                                            onClick={() => handleActionClick("I want to start a project")}
                                        >
                                            Start a Project
                                        </Button>
                                    </div>
                                )}

                                {/* Service Options (only show when asking for service) */}
                                {chatState === "ask_service" && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {SERVICES.map((service) => (
                                            <Button
                                                key={service}
                                                variant="outline"
                                                size="sm"
                                                className="text-xs rounded-full border-primary/20 hover:border-primary/50"
                                                onClick={() => handleActionClick(service)}
                                            >
                                                {service}
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-3 border-t border-border bg-muted/30">
                            <form
                                onSubmit={handleSend}
                                className="flex items-center gap-2 relative"
                            >
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={
                                        chatState === "ask_service"
                                            ? "Or type a different service..."
                                            : "Type your message..."
                                    }
                                    disabled={chatState === "finished"}
                                    className="rounded-full pr-10 bg-white dark:bg-background"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || chatState === "finished"}
                                    className="absolute right-1 h-8 w-8 rounded-full"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
