import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  DollarSign,
  Users,
  Scissors,
  Plus,
  AlertCircle,
  CalendarDays,
  XCircle
} from "lucide-react";
import { generateAllDummyData } from "@/lib/dummyData";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'delivery' | 'production' | 'payment' | 'meeting' | 'cutting' | 'quality' | 'task' | 'event';
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'overdue' | 'cancelled';
  details: string;
  priority: 'low' | 'medium' | 'high';
  department?: string;
  assignedTo?: string;
  assignedBy?: string;
  deadline?: string;
  createdAt?: string;
}

export function CalendarView() {
  const [events, setEvents] = useState<{ [key: string]: CalendarEvent[] }>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'task' as CalendarEvent['type'],
    time: '',
    details: '',
    priority: 'medium' as CalendarEvent['priority'],
    department: '',
    assignedTo: '',
    deadline: '',
    date: ''
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Array<{id: string, name: string, department: string}>>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Array<{id: string, name: string, department: string}>>([]);

  useEffect(() => {
    const generatedData = generateAllDummyData();
    generateCalendarEvents(generatedData);
    
    // Initialize departments and employees
    const departmentList = ['Production', 'Quality Control', 'Design', 'Management', 'Sales', 'Inventory', 'Export', 'Raw Materials', 'Packaging'];
    setDepartments(departmentList);
    
    // Mock employees data
    const employeeList = [
      { id: '1', name: 'John Smith', department: 'Production' },
      { id: '2', name: 'Sarah Johnson', department: 'Production' },
      { id: '3', name: 'Mike Wilson', department: 'Quality Control' },
      { id: '4', name: 'Emily Davis', department: 'Quality Control' },
      { id: '5', name: 'David Brown', department: 'Design' },
      { id: '6', name: 'Lisa Garcia', department: 'Design' },
      { id: '7', name: 'Robert Miller', department: 'Management' },
      { id: '8', name: 'Jennifer Taylor', department: 'Sales' },
      { id: '9', name: 'Christopher Anderson', department: 'Sales' },
      { id: '10', name: 'Amanda Thomas', department: 'Inventory' },
      { id: '11', name: 'James Martinez', department: 'Export' },
      { id: '12', name: 'Maria Rodriguez', department: 'Raw Materials' },
      { id: '13', name: 'Kevin Lee', department: 'Packaging' }
    ];
    setEmployees(employeeList);
    setFilteredEmployees(employeeList);
  }, []);

  // Filter employees when department changes
  useEffect(() => {
    if (newEvent.department) {
      const filtered = employees.filter(emp => emp.department === newEvent.department);
      setFilteredEmployees(filtered);
      // Reset assignedTo if the selected user is not in the new department
      const isAssignedUserInDepartment = filtered.some(emp => emp.id === newEvent.assignedTo);
      if (!isAssignedUserInDepartment) {
        setNewEvent(prev => ({ ...prev, assignedTo: '' }));
      }
    } else {
      setFilteredEmployees(employees);
    }
  }, [newEvent.department, employees]);

  const handleEventStatusChange = (eventId: string, newStatus: 'completed' | 'cancelled') => {
    setEvents(prev => {
      const newEvents = { ...prev };
      Object.keys(newEvents).forEach(dateKey => {
        newEvents[dateKey] = newEvents[dateKey].map(event => 
          event.id === eventId ? { ...event, status: newStatus } : event
        );
      });
      return newEvents;
    });
    setSelectedEvent(null);
    toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'cancelled'} successfully`);
  };

  // Filter events by status
  const allActiveEvents = Object.values(events).flat();
  const activeEvents = allActiveEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const completedEvents = allActiveEvents.filter(e => e.status === 'completed');
  const cancelledEvents = allActiveEvents.filter(e => e.status === 'cancelled');
  const completedCount = completedEvents.length;
  const cancelledCount = cancelledEvents.length;

  // Filter events for calendar display (only active events)
  const activeEventsOnly: { [key: string]: CalendarEvent[] } = {};
  Object.keys(events).forEach(dateKey => {
    const dayActiveEvents = events[dateKey].filter(e => e.status !== 'completed' && e.status !== 'cancelled');
    if (dayActiveEvents.length > 0) {
      activeEventsOnly[dateKey] = dayActiveEvents;
    }
  });

  const generateCalendarEvents = (data: any) => {
    const eventMap: { [key: string]: CalendarEvent[] } = {};
    const departments = ['Production', 'Quality Control', 'Design', 'Management', 'Sales', 'Inventory', 'Export', 'Raw Materials', 'Packaging'];
    
    // Generate events for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateKey = date.toDateString();
      eventMap[dateKey] = [];

      // Add various types of events with more realistic data
      const eventTypes = [
        { type: 'task', titles: ['Quality Check', 'Sewing Line 1', 'Cutting Department', 'Maintenance Check', 'Pattern Making Workshop', 'Packaging & Labeling'] },
        { type: 'delivery', titles: ['Dye Chemicals Delivery', 'Finished Goods Shipment', 'Trim & Hardware Delivery', 'Export Shipment'] },
        { type: 'event', titles: ['Design Review Meeting', 'Supplier Audit', 'Production Planning Meeting', 'Client Visit', 'Weekly Performance Review', 'Inventory Audit'] }
      ];

      // Generate 2-5 events per day
      const numEvents = Math.floor(Math.random() * 4) + 2;
      
      for (let j = 0; j < numEvents; j++) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const title = eventType.titles[Math.floor(Math.random() * eventType.titles.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const hour = Math.floor(Math.random() * 12) + 1;
        const minute = Math.random() > 0.5 ? '00' : '30';
        const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
        
        eventMap[dateKey].push({
          id: `${eventType.type}-${i}-${j}`,
          title,
          type: eventType.type as CalendarEvent['type'],
          time: `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`,
          status: Math.random() > 0.8 ? 'completed' : Math.random() > 0.6 ? 'confirmed' : 'pending',
          details: getEventDetails(eventType.type, title),
          priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
          department
        });
      }
    }

    setEvents(eventMap);
  };

  const getEventDetails = (type: string, title: string) => {
    const details = {
      task: [
        'Final quality inspection for summer collection',
        'Complete 150 t-shirts for Order #MT-2024-003',
        'Cut 200 pieces for denim jacket production',
        'Inspect incoming silk fabric shipment',
        'Review and approve fall collection designs'
      ],
      delivery: [
        'Reactive dyes for next batch coloring',
        'Ship 500 units to Retailer Network East',
        'Buttons, zippers, and other hardware items',
        'Container shipment to European markets'
      ],
      event: [
        'Review and approve fall collection designs',
        'Annual supplier compliance audit',
        'Monthly production capacity analysis',
        'Product showcase and contract discussion',
        'Weekly production capacity review'
      ]
    };
    
    const typeDetails = details[type as keyof typeof details] || details.task;
    return typeDetails[Math.floor(Math.random() * typeDetails.length)];
  };

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getEventColor = (type: string, status: string, priority: string) => {
    if (status === 'completed') return 'bg-green-50 border-l-4 border-l-green-400';
    if (status === 'cancelled') return 'bg-red-50 border-l-4 border-l-red-400';
    
    switch (type) {
      case 'delivery': return 'bg-orange-50 border-l-4 border-l-orange-400';
      case 'task': return 'bg-blue-50 border-l-4 border-l-blue-400';
      case 'event': return 'bg-purple-50 border-l-4 border-l-purple-400';
      case 'production': return 'bg-indigo-50 border-l-4 border-l-indigo-400';
      case 'payment': return 'bg-yellow-50 border-l-4 border-l-yellow-400';
      case 'meeting': return 'bg-pink-50 border-l-4 border-l-pink-400';
      case 'quality': return 'bg-emerald-50 border-l-4 border-l-emerald-400';
      default: return 'bg-gray-50 border-l-4 border-l-gray-400';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'delivery': return 'bg-orange-500 text-white';
      case 'task': return 'bg-blue-500 text-white';
      case 'event': return 'bg-purple-500 text-white';
      case 'production': return 'bg-indigo-500 text-white';
      case 'payment': return 'bg-yellow-500 text-white';
      case 'meeting': return 'bg-pink-500 text-white';
      case 'quality': return 'bg-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent, sourceDate: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ event, sourceDate }));
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    
    const { event, sourceDate } = JSON.parse(data);
    
    if (sourceDate === targetDate) return;

    setEvents(prev => {
      const newEvents = { ...prev };
      // Remove from source
      newEvents[sourceDate] = newEvents[sourceDate]?.filter(e => e.id !== event.id) || [];
      // Add to target
      if (!newEvents[targetDate]) newEvents[targetDate] = [];
      newEvents[targetDate].push({ ...event, id: `${event.id}-moved-${Date.now()}` });
      return newEvents;
    });
    
    toast.success(`Event moved to ${new Date(targetDate).toLocaleDateString()}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error('Please fill in required fields');
      return;
    }

    const dateKey = new Date(newEvent.date).toDateString();
    const assignedEmployee = employees.find(emp => emp.id === newEvent.assignedTo);
    
    const eventToAdd: CalendarEvent = {
      id: `custom-${Date.now()}`,
      title: newEvent.title,
      type: newEvent.type,
      time: newEvent.time || '09:00 AM',
      status: 'pending',
      details: newEvent.details,
      priority: newEvent.priority,
      department: newEvent.department,
      assignedTo: newEvent.assignedTo,
      assignedBy: 'Current User', // This would be the logged-in user
      deadline: newEvent.deadline,
      createdAt: new Date().toISOString()
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventToAdd]
    }));

    // Simulate notification sending
    if (newEvent.assignedTo && assignedEmployee) {
      toast.success(`Task assigned to ${assignedEmployee.name} successfully`);
      // Here you would typically send a real notification
      console.log(`Notification sent to ${assignedEmployee.name}: New task "${newEvent.title}" assigned`);
      console.log(`Notification sent to Admin: Task "${newEvent.title}" created and assigned to ${assignedEmployee.name}`);
    } else {
      toast.success('Event added successfully');
    }

    setNewEvent({
      title: '',
      type: 'task',
      time: '',
      details: '',
      priority: 'medium',
      department: '',
      assignedTo: '',
      deadline: '',
      date: ''
    });
    
    setShowAddEvent(false);
  };

  // Calculate summary statistics for active events only
  const totalActiveItems = activeEvents.length;
  const highPriorityCount = activeEvents.filter(e => e.priority === 'high').length;
  const deliveriesCount = activeEvents.filter(e => e.type === 'delivery').length;

  const next7Days = getNext7Days();
  const today = new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'completed' | 'cancelled')}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2 px-6">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Total Items</div>
                <div className="text-lg font-bold">{totalActiveItems}</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2 px-6">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-lg font-bold text-green-600">{completedCount}</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2 px-6">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Cancelled</div>
                <div className="text-lg font-bold text-red-600">{cancelledCount}</div>
              </div>
            </TabsTrigger>
          </TabsList>

          <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as CalendarEvent['type'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="quality">Quality Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newEvent.priority} onValueChange={(value) => setNewEvent(prev => ({ ...prev, priority: value as CalendarEvent['priority'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newEvent.department} onValueChange={(value) => setNewEvent(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <Select 
                      value={newEvent.assignedTo} 
                      onValueChange={(value) => setNewEvent(prev => ({ ...prev, assignedTo: value }))}
                      disabled={!newEvent.department}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newEvent.department ? "Select employee" : "Select department first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} ({employee.department})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={newEvent.deadline}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    value={newEvent.details}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Enter event details"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddEvent} className="flex-1">
                    Add Event
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddEvent(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="active" className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-primary" />
              7-Day Schedule Calendar
            </h2>
            <p className="text-muted-foreground mt-2">
              Drag and drop events to reschedule. All processes, deliveries, and payments at a glance.
            </p>
          </div>

          {/* Today's Card - Full Width */}
          {(() => {
            const todayEvents = activeEventsOnly[today] || [];
            const isToday = true;
            
            return (
              <Card 
                className="w-full ring-2 ring-primary bg-primary/5 animate-fade-in"
                onDrop={(e) => handleDrop(e, today)}
                onDragOver={handleDragOver}
              >
                <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      Today - {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div className="text-4xl font-bold text-primary mt-2">
                      {new Date().getDate()}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    {todayEvents.length > 0 && (
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-sm">
                          {todayEvents.length} item{todayEvents.length !== 1 ? 's' : ''} scheduled
                        </Badge>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {todayEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {todayEvents
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((event) => (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event, today)}
                            onClick={() => setSelectedEvent(event)}
                            className={`p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all hover-scale ${getEventColor(event.type, event.status, event.priority)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge className={`text-xs px-2 py-1 ${getTypeBadgeColor(event.type)}`}>
                                {event.type.toUpperCase()}
                              </Badge>
                              <div className={`w-3 h-3 rounded-full ${getPriorityDot(event.priority)}`}></div>
                            </div>
                            <p className="text-sm font-semibold leading-tight text-foreground mb-2">
                              {event.title}
                            </p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{event.time}</span>
                              {event.department && <span className="text-xs">• {event.department}</span>}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                              {event.details}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No events scheduled for today</p>
                      <p className="text-sm">Perfect time to plan your day!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          {/* Other Days - Compact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {next7Days.slice(1).map((date, index) => {
              const dateKey = date.toDateString();
              const dayEvents = activeEventsOnly[dateKey] || [];
              const isExpanded = expandedDate === dateKey;
              
              return (
                <Card 
                  key={dateKey}
                  className={`transition-all duration-300 cursor-pointer hover-scale ${
                    isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                  }`}
                  onClick={() => setExpandedDate(isExpanded ? null : dateKey)}
                  onDrop={(e) => handleDrop(e, dateKey)}
                  onDragOver={handleDragOver}
                >
                  <CardHeader className="pb-2 bg-muted/20">
                    <CardTitle className="text-center">
                      <div className="text-sm font-semibold">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xl font-bold">
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {dayEvents.length}
                          </Badge>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1">{/* Dynamic height for all events */}
                      {dayEvents
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((event) => (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event, dateKey)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className={`p-2 rounded border cursor-pointer hover:shadow-sm transition-all ${getEventColor(event.type, event.status, event.priority)} ${
                              isExpanded ? 'mb-2' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <Badge className={`text-xs px-1 py-0.5 ${getTypeBadgeColor(event.type)}`}>
                                {event.type.substring(0, 3).toUpperCase()}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${getPriorityDot(event.priority)}`}></div>
                            </div>
                            <p className="text-xs font-medium leading-tight text-foreground mb-1 line-clamp-2">
                              {event.title}
                            </p>
                            {isExpanded && (
                              <>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{event.time}</span>
                                  {event.department && <span>• {event.department}</span>}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-tight">
                                  {event.details}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      {dayEvents.length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-4">
                          <CalendarDays className="w-4 h-4 mx-auto mb-1 opacity-50" />
                          <p>No events</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-green-50 border border-green-200 rounded-lg hover-scale">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-green-100 text-green-800">
                        {event.type.toUpperCase()}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="font-semibold text-green-900 mb-1">{event.title}</p>
                    <div className="flex items-center justify-between text-sm text-green-700 mb-2">
                      <span>{event.time}</span>
                      {event.department && <span>• {event.department}</span>}
                    </div>
                    <p className="text-xs text-green-600 line-clamp-2">{event.details}</p>
                  </div>
                ))}
                {completedEvents.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-12">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No completed tasks yet</p>
                    <p className="text-sm">Completed tasks will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Cancelled Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cancelledEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-red-50 border border-red-200 rounded-lg hover-scale">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-red-100 text-red-800">
                        {event.type.toUpperCase()}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                    </div>
                    <p className="font-semibold text-red-900 mb-1">{event.title}</p>
                    <div className="flex items-center justify-between text-sm text-red-700 mb-2">
                      <span>{event.time}</span>
                      {event.department && <span>• {event.department}</span>}
                    </div>
                    <p className="text-xs text-red-600 line-clamp-2">{event.details}</p>
                  </div>
                ))}
                {cancelledEvents.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-12">
                    <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No cancelled tasks</p>
                    <p className="text-sm">Cancelled tasks will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge className={`${getTypeBadgeColor(selectedEvent?.type || '')}`}>
                {selectedEvent?.type.toUpperCase()}
              </Badge>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityDot(selectedEvent.priority)}`}></div>
                    <span className="text-sm text-muted-foreground capitalize">{selectedEvent.priority}</span>
                  </div>
                </div>
              </div>
              {selectedEvent.department && (
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-muted-foreground">{selectedEvent.department}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge variant="outline" className="ml-2 capitalize">
                  {selectedEvent.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Details</Label>
                <p className="text-sm text-muted-foreground">{selectedEvent.details}</p>
              </div>
              {selectedEvent.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleEventStatusChange(selectedEvent.id, 'cancelled')}
                    className="flex-1"
                  >
                    Cancel Task
                  </Button>
                  <Button 
                    onClick={() => handleEventStatusChange(selectedEvent.id, 'completed')}
                    className="flex-1"
                  >
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
