"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, CalendarDays, List, Clock, FileText, Users, CheckCircle, AlertCircle, Download, Plus, Repeat, Bell, BarChart3, ChevronLeft, ChevronRight, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

// Event type
interface EventType {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: Date;
  status: "Overdue" | "Due Soon" | "Due This Month" | "Completed" | "Scheduled";
  assignedTo: string;
  requiredDocs: string[];
  agentActions: string[];
  notes: string;
  attachments: { name: string; type: string; size: string }[];
}

// Mock data for events
const mockEvents: EventType[] = [
  {
    id: "1",
    title: "GST Filing Q2",
    description: "Quarterly GST return filing deadline.",
    type: "GST Filing",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "Overdue",
    assignedTo: "Priya Sharma",
    requiredDocs: ["Sales Register", "Purchase Register"],
    agentActions: ["File GST Return"],
    notes: "Pending due to missing purchase invoices.",
    attachments: [
      { name: "SalesRegister.pdf", type: "pdf", size: "245KB" },
    ],
  },
  {
    id: "2",
    title: "ITR Submission FY23",
    description: "Income Tax Return submission for FY23.",
    type: "ITR Submission",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
    status: "Due Soon",
    assignedTo: "Amit Verma",
    requiredDocs: ["Form 16", "Bank Statements"],
    agentActions: ["Prepare ITR"],
    notes: "Form 16 received, bank statement pending.",
    attachments: [],
  },
  {
    id: "3",
    title: "License Renewal - FSSAI",
    description: "Renewal of FSSAI food license.",
    type: "License Renewal",
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // in 20 days
    status: "Due This Month",
    assignedTo: "Rohit Singh",
    requiredDocs: ["Old License Copy", "Renewal Form"],
    agentActions: ["Renew License"],
    notes: "Renewal form filled, pending payment.",
    attachments: [],
  },
  {
    id: "4",
    title: "Statutory Audit",
    description: "Annual statutory audit for FY23.",
    type: "Audit",
    dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // in 40 days
    status: "Scheduled",
    assignedTo: "Audit Team",
    requiredDocs: ["Ledger", "Trial Balance"],
    agentActions: ["Schedule Audit"],
    notes: "All documents uploaded.",
    attachments: [],
  },
  {
    id: "5",
    title: "Board Meeting Q3",
    description: "Quarterly board meeting for compliance review.",
    type: "Board Meeting",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // in 10 days
    status: "Due Soon",
    assignedTo: "Board Members",
    requiredDocs: ["Agenda", "Previous Minutes"],
    agentActions: ["Send Invites"],
    notes: "Agenda finalized.",
    attachments: [],
  },
  {
    id: "6",
    title: "Annual Filing MCA",
    description: "Annual return filing with Ministry of Corporate Affairs.",
    type: "Annual Filing",
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    status: "Completed",
    assignedTo: "Legal Team",
    requiredDocs: ["Annual Return Form"],
    agentActions: ["Download Filed Return"],
    notes: "Filed successfully.",
    attachments: [
      { name: "AnnualReturn2023.pdf", type: "pdf", size: "1.2MB" },
    ],
  },
];

const statusColor: { [key: string]: string } = {
  Overdue: "bg-red-100 text-red-700 border-red-300",
  "Due Soon": "bg-orange-100 text-orange-700 border-orange-300",
  "Due This Month": "bg-yellow-100 text-yellow-800 border-yellow-300",
  Completed: "bg-green-100 text-green-700 border-green-300",
  Scheduled: "bg-blue-100 text-blue-700 border-blue-300",
};

const statusDot: { [key: string]: string } = {
  Overdue: "bg-red-500",
  "Due Soon": "bg-orange-500",
  "Due This Month": "bg-yellow-400",
  Completed: "bg-green-500",
  Scheduled: "bg-blue-500",
};

const viewTabs = [
  { key: "month", label: "Monthly", icon: CalendarDays },
  { key: "week", label: "Weekly", icon: Calendar },
  { key: "list", label: "List", icon: List },
  { key: "agenda", label: "Agenda", icon: Clock },
];

interface ComplianceCalendarProps {
  className?: string;
  compact?: boolean;
}

export default function ComplianceCalendar({ className, compact = false }: ComplianceCalendarProps) {
  const [view, setView] = useState<string>("month");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Helper to format date
  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  // Quick Actions
  const quickActions = [
    { label: "Add Deadline", icon: Plus },
    { label: "Bulk Reschedule", icon: Repeat },
    { label: "Compliance Report", icon: BarChart3 },
    { label: "Set Reminders", icon: Bell },
    { label: "Export", icon: Download },
  ];

  // Calendar grid for monthly view (mocked for now)
  const daysInMonth = 30;
  const today = new Date();
  const monthDays: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));

  // Filter events for each view
  const getEventsForDay = (date: Date) =>
    mockEvents.filter((e) =>
      e.dueDate.getDate() === date.getDate() &&
      e.dueDate.getMonth() === date.getMonth() &&
      e.dueDate.getFullYear() === date.getFullYear()
    );

  if (compact) {
    return (
      <Card className={cn("border-[#D1C4B8]", className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#2A2A2A]">
            <Calendar className="w-5 h-5 text-[#8B4513]" />
            <span>Compliance Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Compact view - show upcoming deadlines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2A2A2A]">Upcoming Deadlines</span>
              <Button variant="outline" size="sm" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {mockEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 hover:bg-[#F8F3EE] rounded-lg cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDetailsOpen(true);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className={cn("inline-block w-2 h-2 rounded-full", statusDot[event.status])}></span>
                    <div>
                      <p className="text-sm font-medium text-[#2A2A2A]">{event.title}</p>
                      <p className="text-xs text-[#8B7355]">{event.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={cn("text-xs", statusColor[event.status])}>{event.status}</Badge>
                    <p className="text-xs text-[#8B7355] mt-1">{formatDate(event.dueDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2A2A2A] mb-1">Compliance Calendar</h2>
          <p className="text-[#8B7355]">Track all your compliance deadlines and events</p>
        </div>
        <div className="flex space-x-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.label} variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white flex items-center space-x-2">
                <Icon className="w-4 h-4 mr-1" />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-2">
        {viewTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={view === tab.key ? "default" : "outline"}
              className={cn(
                view === tab.key
                  ? "bg-[#8B4513] text-white border-[#8B4513]"
                  : "border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white",
                "flex items-center space-x-2"
              )}
              onClick={() => setView(tab.key)}
            >
              <Icon className="w-4 h-4 mr-1" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Calendar Views */}
      <Card className="border-[#D1C4B8]">
        <CardContent className="p-6">
          {view === "month" && (
            <div>
              {/* Month grid mockup */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {monthDays.map((date, idx) => (
                  <div key={idx} className="h-24 border border-[#E8DDD1] rounded-lg p-1 relative bg-[#F8F3EE]">
                    <div className="text-xs text-[#8B7355] font-semibold mb-1">{date.getDate()}</div>
                    <div className="space-y-1">
                      {getEventsForDay(date).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "cursor-pointer px-2 py-1 rounded text-xs font-medium border",
                            statusColor[event.status]
                          )}
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <span className={cn("inline-block w-2 h-2 rounded-full mr-1", statusDot[event.status])}></span>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view === "week" && (
            <div>
              {/* Week view mockup */}
              <div className="flex space-x-4">
                {monthDays.slice(0, 7).map((date, idx) => (
                  <div key={idx} className="flex-1 border border-[#E8DDD1] rounded-lg p-2 bg-[#F8F3EE]">
                    <div className="text-xs text-[#8B7355] font-semibold mb-1">{date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</div>
                    <div className="space-y-1">
                      {getEventsForDay(date).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "cursor-pointer px-2 py-1 rounded text-xs font-medium border",
                            statusColor[event.status]
                          )}
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <span className={cn("inline-block w-2 h-2 rounded-full mr-1", statusDot[event.status])}></span>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view === "list" && (
            <div>
              {/* List view */}
              <div className="divide-y divide-[#E8DDD1]">
                {mockEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-[#F8F3EE]"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn("inline-block w-2 h-2 rounded-full", statusDot[event.status])}></span>
                      <span className="font-medium text-[#2A2A2A]">{event.title}</span>
                      <Badge className={cn("text-xs", statusColor[event.status])}>{event.status}</Badge>
                    </div>
                    <div className="text-xs text-[#8B7355]">{formatDate(event.dueDate)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {view === "agenda" && (
            <div>
              {/* Agenda view */}
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <Card key={event.id} className="border-[#D1C4B8] cursor-pointer hover:shadow-lg" onClick={() => { setSelectedEvent(event); setIsDetailsOpen(true); }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-2">
                        <span className={cn("inline-block w-2 h-2 rounded-full", statusDot[event.status])}></span>
                        <CardTitle className="text-base text-[#2A2A2A]">{event.title}</CardTitle>
                        <Badge className={cn("text-xs", statusColor[event.status])}>{event.status}</Badge>
                      </div>
                      <div className="text-xs text-[#8B7355]">{formatDate(event.dueDate)}</div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div className="text-xs text-[#8B7355] mb-1">{event.type}</div>
                      <div className="text-sm text-[#2A2A2A]">{event.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#8B4513]" />
                  <span>{selectedEvent.title}</span>
                </DialogTitle>
                <DialogDescription>{selectedEvent.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", statusColor[selectedEvent.status])}>{selectedEvent.status}</Badge>
                  <span className="text-xs text-[#8B7355]">Due: {formatDate(selectedEvent.dueDate)} {formatTime(selectedEvent.dueDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#8B7355]" />
                  <span className="text-sm text-[#2A2A2A]">Assigned to: {selectedEvent.assignedTo}</span>
                </div>
                <div>
                  <span className="text-xs text-[#8B7355]">Required Documents:</span>
                  <ul className="list-disc ml-6 text-sm text-[#2A2A2A]">
                    {selectedEvent.requiredDocs.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs text-[#8B7355]">Agent Actions:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEvent.agentActions.map((action, idx) => (
                      <Button key={idx} size="sm" className="bg-[#8B4513] hover:bg-[#6B3410] text-white">{action}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#8B7355]">Notes:</span>
                  <div className="text-sm text-[#2A2A2A] bg-[#F8F3EE] rounded p-2 mt-1">{selectedEvent.notes}</div>
                </div>
                <div>
                  <span className="text-xs text-[#8B7355]">Attachments:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEvent.attachments.length === 0 && <span className="text-xs text-[#8B7355]">None</span>}
                    {selectedEvent.attachments.map((file, idx) => (
                      <Button key={idx} variant="outline" size="sm" className="border-[#8B4513] text-[#8B4513] flex items-center space-x-1">
                        <Paperclip className="w-3 h-3 mr-1" />
                        <span>{file.name}</span>
                        <span className="text-xs text-[#8B7355]">({file.size})</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
