import { useNavigate } from 'react-router-dom';
import { useEmployers } from '../hooks/useEmployers';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

export function EmployerListPage() {
  const navigate = useNavigate();
  const { data: employers = [], isLoading, isError } = useEmployers();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployers = useMemo(() => {
    if (!searchQuery) return employers;
    const lowerQuery = searchQuery.toLowerCase();
    return employers.filter(emp => 
      emp.companyName.toLowerCase().includes(lowerQuery) ||
      emp.webAddress.toLowerCase().includes(lowerQuery)
    );
  }, [employers, searchQuery]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium text-lg">Failed to load partners.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Employer Partners</h1>
            <p className="text-muted-foreground text-lg">Meet the top companies hiring on our platform.</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter companies..." 
              className="pl-10 h-11 bg-card/80 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none ring-1 ring-border/50 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEmployers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-16 text-center border-2 border-dashed border-muted-foreground/20"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No companies found</h3>
            <p className="text-muted-foreground">Try a different search term or check back later.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer, index) => (
              <motion.div
                key={employer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="group relative h-full transition-all duration-300 border-none ring-1 ring-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/employers/${employer.id}`)}
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16 rounded-xl border border-border shadow-sm transform group-hover:scale-105 transition-transform">
                        <AvatarImage src={employer.photoUrl} alt={employer.companyName} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                          <Building2 className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">
                          {employer.companyName}
                        </h3>
                        <Badge variant="secondary" className="mt-1 font-medium bg-secondary/40 text-secondary-foreground/80">
                          Partner Employer
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center text-muted-foreground hover:text-primary transition-colors cursor-pointer group/link">
                        <Globe className="h-4 w-4 mr-3 shrink-0 opacity-60 group-hover/link:opacity-100" />
                        <span className="text-sm truncate font-medium underline-offset-4 group-hover/link:underline">
                          {employer.webAddress}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-3 shrink-0 opacity-60" />
                        <span className="text-sm font-medium">{employer.phoneNumber}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-3 shrink-0 opacity-60" />
                        <span className="text-sm truncate font-medium">{employer.email}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-auto font-bold group/btn">
                      View Profile
                      <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
