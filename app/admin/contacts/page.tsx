"use client";

import { useState, useEffect } from "react";
import { useConditionalUser } from "@/hooks/use-conditional-user";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  Settings,
  Search,
  Filter,
  Download,
  BarChart3,
} from "lucide-react";

// Helper function to format dates
const formatDate = (date: Date, formatType: "short" | "full" = "short") => {
  if (formatType === "short") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  countryCode?: string | null;
  company?: string | null;
  businessName?: string | null;
  businessWebsite?: string | null;
  services?: string[] | null;
  subject?: string | null;
  message: string;
  status: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ContactSettings {
  id: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  workingHours?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  behanceUrl?: string | null;
  enablePhoneField: boolean;
  requirePhoneField: boolean;
  autoReplyEnabled: boolean;
  autoReplyMessage?: string | null;
  notificationEmail?: string | null;
  emailNotifications: boolean;
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}

export default function ContactsAdminPage() {
  const user = useConditionalUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Partial<ContactSettings>>(
    {}
  );

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/contacts/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setSettingsForm(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/contacts/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchSettings();
    fetchStats();
  }, []);

  // Redirect if not authenticated (but wait for user to load)
  if (user === null) {
    redirect("/handler/sign-in");
  }

  // Show loading state while user is being determined
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setContacts(
          contacts.map((contact) =>
            contact.id === contactId
              ? { ...contact, status: newStatus }
              : contact
          )
        );
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContacts(contacts.filter((contact) => contact.id !== contactId));
        setSelectedContact(null);
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const updateSettings = async () => {
    try {
      const response = await fetch('/api/contacts/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsForm),
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        setIsSettingsOpen(false);
        // You could add a toast notification here for success
        console.log('Settings updated successfully');
      } else {
        console.error('Failed to update settings');
        // You could add a toast notification here for error
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      // You could add a toast notification here for error
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "read":
        return "bg-yellow-500";
      case "replied":
        return "bg-green-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.subject &&
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] text-[#E9E7E2] p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5001]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-[#E9E7E2] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contact Management</h1>
            <p className="text-[#E9E7E2]/70">
              Manage contact form submissions and settings
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="outline"
              className="border-[#333333] text-[#E9E7E2] hover:bg-[#252525]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E9E7E2]/70">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-[#FF5001]" />
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E9E7E2]/70">New</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.new}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-blue-400" />
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E9E7E2]/70">Read</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.read}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-yellow-400" />
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E9E7E2]/70">Replied</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.replied}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-green-400" />
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E9E7E2]/70">Archived</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {stats.archived}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-[#1A1A1A] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#E9E7E2]/50" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#252525] border-[#333333] text-[#E9E7E2]"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-[#252525] border-[#333333] text-[#E9E7E2]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#252525] border-[#333333]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Contacts Table */}
        <Card className="bg-[#1A1A1A]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#333333]">
                <TableHead className="text-[#E9E7E2]">Name</TableHead>
                <TableHead className="text-[#E9E7E2]">Email</TableHead>
                <TableHead className="text-[#E9E7E2]">Phone</TableHead>
                <TableHead className="text-[#E9E7E2]">Subject</TableHead>
                <TableHead className="text-[#E9E7E2]">Status</TableHead>
                <TableHead className="text-[#E9E7E2]">Date</TableHead>
                <TableHead className="text-[#E9E7E2]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="border-[#333333]">
                  <TableCell className="text-[#E9E7E2]">
                    {contact.name}
                  </TableCell>
                  <TableCell className="text-[#E9E7E2]">
                    {contact.email}
                  </TableCell>
                  <TableCell className="text-[#E9E7E2]">
                    {contact.phone || "-"}
                  </TableCell>
                  <TableCell className="text-[#E9E7E2]">
                    {contact.subject ? (
                      <span className="truncate max-w-[200px] block">
                        {contact.subject}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusBadgeColor(
                        contact.status
                      )} text-white`}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#E9E7E2]">
                    {formatDate(new Date(contact.createdAt), "short")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#333333] text-[#E9E7E2] hover:bg-[#252525]"
                            onClick={() => {
                              setSelectedContact(contact);
                              if (contact.status === "new") {
                                updateContactStatus(contact.id, "read");
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Contact Details</DialogTitle>
                            <DialogDescription className="text-[#E9E7E2]/70">
                              View and manage contact information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedContact && (
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                              {/* Personal Information */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#FF5001] border-b border-[#333333] pb-2">
                                  Personal Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Name
                                    </Label>
                                    <p className="text-[#E9E7E2] mt-1">
                                      {selectedContact.name}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Email
                                    </Label>
                                    <p className="text-[#E9E7E2] mt-1 break-all">
                                      <a href={`mailto:${selectedContact.email}`} className="hover:text-[#FF5001] transition-colors">
                                        {selectedContact.email}
                                      </a>
                                    </p>
                                  </div>
                                  {selectedContact.phone && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Phone
                                      </Label>
                                      <p className="text-[#E9E7E2] mt-1">
                                        {selectedContact.countryCode && selectedContact.countryCode !== '+880' 
                                          ? `${selectedContact.countryCode} ${selectedContact.phone}`
                                          : selectedContact.phone
                                        }
                                      </p>
                                    </div>
                                  )}
                                  {selectedContact.countryCode && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Country Code
                                      </Label>
                                      <p className="text-[#E9E7E2] mt-1">
                                        {selectedContact.countryCode}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Business Information */}
                              {(selectedContact.company || selectedContact.businessName || selectedContact.businessWebsite) && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-4 text-[#FF5001] border-b border-[#333333] pb-2">
                                    Business Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    {selectedContact.company && (
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Company
                                        </Label>
                                        <p className="text-[#E9E7E2] mt-1">
                                          {selectedContact.company}
                                        </p>
                                      </div>
                                    )}
                                    {selectedContact.businessName && (
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Business Name
                                        </Label>
                                        <p className="text-[#E9E7E2] mt-1">
                                          {selectedContact.businessName}
                                        </p>
                                      </div>
                                    )}
                                    {selectedContact.businessWebsite && (
                                      <div className="col-span-2">
                                        <Label className="text-sm font-medium">
                                          Business Website
                                        </Label>
                                        <p className="text-[#E9E7E2] mt-1 break-all">
                                          <a 
                                            href={selectedContact.businessWebsite.startsWith('http') 
                                              ? selectedContact.businessWebsite 
                                              : `https://${selectedContact.businessWebsite}`
                                            } 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="hover:text-[#FF5001] transition-colors"
                                          >
                                            {selectedContact.businessWebsite}
                                          </a>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Services */}
                              {selectedContact.services && selectedContact.services.length > 0 && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-4 text-[#FF5001] border-b border-[#333333] pb-2">
                                    Services of Interest
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedContact.services.map((service, index) => (
                                      <Badge key={index} variant="secondary" className="bg-[#252525] text-[#E9E7E2] border-[#333333]">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Message Content */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#FF5001] border-b border-[#333333] pb-2">
                                  Message Details
                                </h3>
                                {selectedContact.subject && (
                                  <div className="mb-4">
                                    <Label className="text-sm font-medium">
                                      Subject
                                    </Label>
                                    <p className="text-[#E9E7E2] mt-1 font-medium">
                                      {selectedContact.subject}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm font-medium">
                                    Message
                                  </Label>
                                  <div className="text-[#E9E7E2] mt-1 whitespace-pre-wrap bg-[#252525] p-4 rounded-lg border border-[#333333] max-h-40 overflow-y-auto">
                                    {selectedContact.message}
                                  </div>
                                </div>
                              </div>

                              {/* Technical Information */}
                              {(selectedContact.ipAddress || selectedContact.userAgent) && (
                                <div>
                                  <h3 className="text-lg font-semibold mb-4 text-[#FF5001] border-b border-[#333333] pb-2">
                                    Technical Information
                                  </h3>
                                  <div className="space-y-3">
                                    {selectedContact.ipAddress && (
                                      <div>
                                        <Label className="text-sm font-medium">
                                          IP Address
                                        </Label>
                                        <p className="text-[#E9E7E2] mt-1 font-mono text-sm">
                                          {selectedContact.ipAddress}
                                        </p>
                                      </div>
                                    )}
                                    {selectedContact.userAgent && (
                                      <div>
                                        <Label className="text-sm font-medium">
                                          User Agent
                                        </Label>
                                        <p className="text-[#E9E7E2] mt-1 text-sm bg-[#252525] p-2 rounded border border-[#333333] break-all">
                                          {selectedContact.userAgent}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Status and Timestamps */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4 text-[#FF5001] border-b border-[#333333] pb-2">
                                  Status & Timeline
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Status
                                    </Label>
                                    <Select
                                      value={selectedContact.status}
                                      onValueChange={(value) => {
                                        updateContactStatus(
                                          selectedContact.id,
                                          value
                                        );
                                        setSelectedContact({
                                          ...selectedContact,
                                          status: value,
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="w-full bg-[#252525] border-[#333333] text-[#E9E7E2] mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#252525] border-[#333333]">
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                        <SelectItem value="replied">
                                          Replied
                                        </SelectItem>
                                        <SelectItem value="archived">
                                          Archived
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Submitted
                                    </Label>
                                    <p className="text-[#E9E7E2] mt-1">
                                      {formatDate(
                                        new Date(selectedContact.createdAt),
                                        "full"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Last Updated
                                    </Label>
                                    <p className="text-[#E9E7E2] mt-1">
                                      {formatDate(
                                        new Date(selectedContact.updatedAt),
                                        "full"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Contact ID
                                    </Label>
                                    <p className="text-[#E9E7E2] mt-1 font-mono text-sm">
                                      {selectedContact.id}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                        onClick={() => deleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-[#E9E7E2]/50">
              No contacts found matching your criteria.
            </div>
          )}
        </Card>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-[#E9E7E2] max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Settings</DialogTitle>
              <DialogDescription className="text-[#E9E7E2]/70">
                Configure contact information and form settings
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#252525]">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-[#FF5001]"
                >
                  Contact Info
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-[#FF5001]"
                >
                  Social Media
                </TabsTrigger>
                <TabsTrigger
                  value="form"
                  className="data-[state=active]:bg-[#FF5001]"
                >
                  Form Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={settingsForm.email || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          email: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="hello@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settingsForm.phone || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          phone: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settingsForm.address || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        address: e.target.value,
                      })
                    }
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                <div>
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={settingsForm.workingHours || ""}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        workingHours: e.target.value,
                      })
                    }
                    className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                    placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="twitterUrl">Twitter URL</Label>
                    <Input
                      id="twitterUrl"
                      value={settingsForm.twitterUrl || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          twitterUrl: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={settingsForm.linkedinUrl || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          linkedinUrl: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="https://linkedin.com/company/name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      value={settingsForm.instagramUrl || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          instagramUrl: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="behanceUrl">Behance URL</Label>
                    <Input
                      id="behanceUrl"
                      value={settingsForm.behanceUrl || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          behanceUrl: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="https://behance.net/username"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="form" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enablePhoneField"
                      checked={settingsForm.enablePhoneField || false}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          enablePhoneField: e.target.checked,
                        })
                      }
                      className="rounded border-[#333333] bg-[#252525]"
                    />
                    <Label htmlFor="enablePhoneField">
                      Enable phone field in contact form
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requirePhoneField"
                      checked={settingsForm.requirePhoneField || false}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          requirePhoneField: e.target.checked,
                        })
                      }
                      className="rounded border-[#333333] bg-[#252525]"
                    />
                    <Label htmlFor="requirePhoneField">
                      Make phone field required
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={settingsForm.emailNotifications || false}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="rounded border-[#333333] bg-[#252525]"
                    />
                    <Label htmlFor="emailNotifications">
                      Enable email notifications
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="notificationEmail">
                      Notification Email
                    </Label>
                    <Input
                      id="notificationEmail"
                      value={settingsForm.notificationEmail || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          notificationEmail: e.target.value,
                        })
                      }
                      className="bg-[#252525] border-[#333333] text-[#E9E7E2]"
                      placeholder="admin@company.com"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
                className="border-[#333333] text-[#E9E7E2] hover:bg-[#252525]"
              >
                Cancel
              </Button>
              <Button
                onClick={updateSettings}
                className="bg-[#FF5001] text-[#161616] hover:bg-[#FF5001]/90"
              >
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
