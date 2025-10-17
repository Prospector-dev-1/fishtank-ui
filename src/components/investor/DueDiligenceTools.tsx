import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from "@/components/investor/ui/use-toast";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  Brain,
  Download,
  Upload,
  Share2,
  Star,
  Flag,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from "@/lib/investor/utils";

interface DDItem {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  notes?: string;
  documents?: string[];
  completedAt?: string;
  risk?: 'low' | 'medium' | 'high';
}

interface DDTemplate {
  id: string;
  name: string;
  description: string;
  categories: Array<{
    name: string;
    items: Omit<DDItem, 'id' | 'status'>[];
  }>;
}

const defaultTemplates: DDTemplate[] = [
  {
    id: 'tech-startup',
    name: 'Tech Startup Template',
    description: 'Comprehensive DD checklist for technology startups',
    categories: [
      {
        name: 'Business Model',
        items: [
          { title: 'Revenue model validation', category: 'Business Model', priority: 'high' },
          { title: 'Market size analysis', category: 'Business Model', priority: 'high' },
          { title: 'Customer acquisition strategy', category: 'Business Model', priority: 'medium' },
          { title: 'Competitive landscape assessment', category: 'Business Model', priority: 'medium' }
        ]
      },
      {
        name: 'Technology',
        items: [
          { title: 'Technical architecture review', category: 'Technology', priority: 'high' },
          { title: 'IP portfolio analysis', category: 'Technology', priority: 'high' },
          { title: 'Scalability assessment', category: 'Technology', priority: 'medium' },
          { title: 'Security audit', category: 'Technology', priority: 'critical' }
        ]
      },
      {
        name: 'Team',
        items: [
          { title: 'Founder background verification', category: 'Team', priority: 'critical' },
          { title: 'Key personnel assessment', category: 'Team', priority: 'high' },
          { title: 'Equity distribution review', category: 'Team', priority: 'medium' },
          { title: 'Advisory board evaluation', category: 'Team', priority: 'low' }
        ]
      },
      {
        name: 'Financials',
        items: [
          { title: 'Financial model validation', category: 'Financials', priority: 'critical' },
          { title: 'Burn rate analysis', category: 'Financials', priority: 'high' },
          { title: 'Previous funding verification', category: 'Financials', priority: 'high' },
          { title: 'Unit economics assessment', category: 'Financials', priority: 'high' }
        ]
      },
      {
        name: 'Legal',
        items: [
          { title: 'Corporate structure review', category: 'Legal', priority: 'high' },
          { title: 'Contract analysis', category: 'Legal', priority: 'medium' },
          { title: 'Regulatory compliance check', category: 'Legal', priority: 'high' },
          { title: 'Employment agreements review', category: 'Legal', priority: 'low' }
        ]
      }
    ]
  }
];

export function DueDiligenceTools() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('tech-startup');
  const [ddItems, setDDItems] = useState<DDItem[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<DDItem>>({
    title: '',
    category: '',
    priority: 'medium',
    status: 'pending'
  });
  
  const { toast } = useToast();

  // Initialize items from template
  const initializeFromTemplate = useCallback((templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (!template) return;

    const items: DDItem[] = [];
    template.categories.forEach(category => {
      category.items.forEach(item => {
        items.push({
          ...item,
          id: `dd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending'
        });
      });
    });

    setDDItems(items);
    toast({
      title: 'Template Loaded',
      description: `${items.length} due diligence items added from ${template.name}`
    });
  }, [toast]);

  // Filter and search items
  const filteredItems = ddItems.filter(item => {
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.priority !== 'all' && item.priority !== filters.priority) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate progress
  const progress = ddItems.length > 0 
    ? (ddItems.filter(item => item.status === 'completed').length / ddItems.length) * 100 
    : 0;

  const statusCounts = {
    pending: ddItems.filter(item => item.status === 'pending').length,
    'in-progress': ddItems.filter(item => item.status === 'in-progress').length,
    completed: ddItems.filter(item => item.status === 'completed').length,
    blocked: ddItems.filter(item => item.status === 'blocked').length
  };

  const updateItemStatus = (id: string, status: DDItem['status']) => {
    setDDItems(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status, 
            completedAt: status === 'completed' ? new Date().toISOString() : undefined 
          }
        : item
    ));
    
    toast({
      title: 'Status Updated',
      description: `Item marked as ${status.replace('-', ' ')}`
    });
  };

  const addNewItem = () => {
    if (!newItem.title || !newItem.category) {
      toast({
        title: 'Error',
        description: 'Please fill in title and category',
        variant: 'destructive'
      });
      return;
    }

    const item: DDItem = {
      id: `dd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newItem.title!,
      category: newItem.category!,
      priority: newItem.priority as DDItem['priority'],
      status: 'pending'
    };

    setDDItems(prev => [...prev, item]);
    setNewItem({ title: '', category: '', priority: 'medium', status: 'pending' });
    setIsAddingItem(false);
    
    toast({
      title: 'Item Added',
      description: 'New due diligence item created'
    });
  };

  const deleteItem = (id: string) => {
    setDDItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Item Deleted',
      description: 'Due diligence item removed'
    });
  };

  const getPriorityColor = (priority: DDItem['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: DDItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-success" />;
      case 'in-progress': return <Clock size={16} className="text-warning" />;
      case 'blocked': return <AlertTriangle size={16} className="text-destructive" />;
      default: return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  const categories = Array.from(new Set(ddItems.map(item => item.category)));

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-display">Due Diligence Tools</h1>
          <p className="text-body text-muted-foreground">
            Comprehensive checklist and workflow management
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="min-h-[44px]">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
          
          <Button variant="outline" size="sm" className="min-h-[44px]">
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{Math.round(progress)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
              <Progress value={progress} className="mt-2" />
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="glass-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {status.replace('-', ' ')}
                </div>
                <div className="mt-2 flex justify-center">
                  {getStatusIcon(status as DDItem['status'])}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="checklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist" className="min-h-[44px]">Checklist</TabsTrigger>
          <TabsTrigger value="templates" className="min-h-[44px]">Templates</TabsTrigger>
          <TabsTrigger value="analytics" className="min-h-[44px]">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-6">
          {/* Filters and Search */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search due diligence items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={() => setIsAddingItem(true)}
                    className="min-h-[44px]"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Item Modal */}
          {isAddingItem && (
            <Card className="glass-card border-primary">
              <CardHeader>
                <CardTitle>Add New DD Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Item title"
                  value={newItem.title || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                />
                
                <Input
                  placeholder="Category"
                  value={newItem.category || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                />
                
                <Select 
                  value={newItem.priority} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value as DDItem['priority'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2">
                  <Button onClick={addNewItem} className="min-h-[44px]">
                    Add Item
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingItem(false)}
                    className="min-h-[44px]"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* DD Items List */}
          <div className="space-y-4">
            {categories.map(category => {
              const categoryItems = filteredItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <Card key={category} className="glass-card">
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <span>{category}</span>
                            <Badge variant="secondary">{categoryItems.length}</Badge>
                          </CardTitle>
                          <ChevronDown size={20} className="text-muted-foreground" />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {categoryItems.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center space-x-4 flex-1">
                                <Checkbox
                                  checked={item.status === 'completed'}
                                  onCheckedChange={(checked) => 
                                    updateItemStatus(item.id, checked ? 'completed' : 'pending')
                                  }
                                />
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className={cn(
                                      'font-medium',
                                      item.status === 'completed' && 'line-through text-muted-foreground'
                                    )}>
                                      {item.title}
                                    </span>
                                    <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                                      {item.priority}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(item.status)}
                                      <span className="capitalize">{item.status.replace('-', ' ')}</span>
                                    </div>
                                    
                                    {item.completedAt && (
                                      <div className="flex items-center space-x-1">
                                        <Calendar size={14} />
                                        <span>
                                          Completed {new Date(item.completedAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={item.status}
                                  onValueChange={(value) => updateItemStatus(item.id, value as DDItem['status'])}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteItem(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {defaultTemplates.map(template => (
              <Card key={template.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <Button
                      onClick={() => initializeFromTemplate(template.id)}
                      className="min-h-[44px]"
                    >
                      Use Template
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {template.categories.map(category => (
                      <div key={category.name} className="space-y-2">
                        <h4 className="font-semibold text-sm">{category.name}</h4>
                        <div className="space-y-1">
                          {category.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                              <CheckCircle size={12} />
                              <span>{item.title}</span>
                            </div>
                          ))}
                          {category.items.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{category.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 size={20} />
                  <span>Completion Rate by Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryItems = ddItems.filter(item => item.category === category);
                    const completed = categoryItems.filter(item => item.status === 'completed').length;
                    const percentage = categoryItems.length > 0 ? (completed / categoryItems.length) * 100 : 0;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{completed}/{categoryItems.length} ({Math.round(percentage)}%)</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target size={20} />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">Medium</div>
                    <div className="text-sm text-muted-foreground">Overall Risk Level</div>
                  </div>
                  
                  <div className="space-y-3">
                    {['High Priority Incomplete', 'Critical Items Pending', 'Blocked Items'].map((risk, index) => (
                      <div key={risk} className="flex items-center justify-between">
                        <span className="text-sm">{risk}</span>
                        <Badge variant={index === 0 ? 'destructive' : index === 1 ? 'default' : 'secondary'}>
                          {Math.floor(Math.random() * 5) + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}