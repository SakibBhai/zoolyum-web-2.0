"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Crown, Info, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  designation: string | null;
  position: string | null;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  status: string;
  featured: boolean;
}

interface LeadershipConfigProps {
  allTeamMembers: TeamMember[];
}

export function LeadershipConfig({ allTeamMembers }: LeadershipConfigProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const featuredMembers = allTeamMembers.filter(m => m.featured);
  const regularMembers = allTeamMembers.filter(m => !m.featured);

  const toggleFeatured = async (memberId: string, currentFeatured: boolean) => {
    setUpdating(memberId);
    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featured: !currentFeatured
        })
      });

      if (!response.ok) throw new Error("Failed to update");

      const member = allTeamMembers.find(m => m.id === memberId);
      toast.success(
        `${member?.name} ${!currentFeatured ? 'added to' : 'removed from'} Leadership Team`
      );

      router.refresh();
    } catch (error) {
      toast.error("Failed to update featured status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
            <div className="flex-1">
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Leadership Team Configuration
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Team members marked as "Featured" will appear in the Leadership section on the Team page
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-200">
          <div className="space-y-2 text-sm">
            <p>• <strong>Featured members</strong> appear in the "Our Leadership Team" section</p>
            <p>• <strong>Regular members</strong> appear in the "The Full Zoolyum Team" section</p>
            <p>• Click the star icon to toggle featured status</p>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
            <Link
              href="/team"
              target="_blank"
              className="text-sm text-blue-600 dark:text-blue-300 hover:underline inline-flex items-center gap-1"
            >
              View Team Page →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{allTeamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{featuredMembers.length}</p>
                <p className="text-sm text-muted-foreground">Leadership Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{regularMembers.length}</p>
                <p className="text-sm text-muted-foreground">Regular Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leadership Team */}
      {featuredMembers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  Leadership Team ({featuredMembers.length})
                </CardTitle>
                <CardDescription>
                  These members will appear in the "Our Leadership Team" section
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredMembers.map(member => (
                <Card key={member.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.designation || member.position || 'Team Member'}</p>
                        <Badge variant="secondary" className="mt-2">
                          <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => toggleFeatured(member.id, true)}
                      disabled={updating === member.id}
                    >
                      {updating === member.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
                      )}
                      Remove from Leadership
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>All Team Members ({allTeamMembers.length})</CardTitle>
          <CardDescription>
            Click to add/remove members from Leadership Team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allTeamMembers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold">No team members found</p>
                <p className="text-sm mt-2">
                  Add team members to get started
                </p>
                <Link href="/admin/team/new">
                  <Button className="mt-4">
                    Add Team Member
                  </Button>
                </Link>
              </div>
            ) : (
              allTeamMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.designation || member.position || 'Team Member'}
                      </p>
                    </div>
                    {member.featured && (
                      <Badge variant="secondary" className="ml-2">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                        Leadership
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant={member.featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeatured(member.id, member.featured)}
                    disabled={updating === member.id}
                  >
                    {updating === member.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : member.featured ? (
                      <>
                        <Star className="h-4 w-4 mr-1 fill-yellow-500" />
                        Featured
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-1" />
                        Add to Leadership
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/team/new">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add New Team Member
            </Button>
          </Link>
          <Link href="/admin/team">
            <Button variant="outline" className="w-full justify-start">
              <ArrowRight className="h-4 w-4 mr-2" />
              Manage All Team Members
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
