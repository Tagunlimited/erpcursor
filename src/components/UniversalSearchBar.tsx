import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  url: string;
}

interface UniversalSearchBarProps {
  className?: string;
}

export function UniversalSearchBar({ className }: UniversalSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchEverything();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const searchEverything = async () => {
    try {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      // Search customers (prioritizing mobile number)
      const { data: customers } = await supabase
        .from('customers')
        .select('id, company_name, contact_person, email, phone')
        .or(`phone.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('phone', { ascending: true })
        .limit(5);

      customers?.forEach(customer => {
        searchResults.push({
          id: customer.id,
          title: customer.company_name,
          subtitle: customer.phone || customer.contact_person || customer.email,
          type: 'Customer',
          url: `/crm/customers/${customer.id}`
        });
      });

      // Search orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, status')
        .or(`order_number.ilike.%${searchTerm}%`)
        .limit(5);

      orders?.forEach(order => {
        searchResults.push({
          id: order.id,
          title: order.order_number,
          subtitle: `Status: ${order.status}`,
          type: 'Order',
          url: `/orders/${order.id}`
        });
      });

      // Search products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, code, category')
        .or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(5);

      products?.forEach(product => {
        searchResults.push({
          id: product.id,
          title: product.name,
          subtitle: `${product.code} - ${product.category}`,
          type: 'Product',
          url: `/inventory/products/${product.id}`
        });
      });

      // Search employees  
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, employee_code, designation, personal_phone')
        .or(`full_name.ilike.%${searchTerm}%,employee_code.ilike.%${searchTerm}%,designation.ilike.%${searchTerm}%,personal_phone.ilike.%${searchTerm}%`)
        .limit(5);

      employees?.forEach(employee => {
        searchResults.push({
          id: employee.id,
          title: employee.full_name,
          subtitle: `${employee.employee_code} - ${employee.designation}`,
          type: 'Employee',
          url: `/people/employees/${employee.id}`
        });
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsExpanded(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Mobile: Search Icon */}
      <div className="md:hidden">
        {!isExpanded ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="h-9 w-9"
          >
            <Search className="w-4 h-4" />
          </Button>
        ) : (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
            <div className="w-full max-w-sm mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search everything..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {(results.length > 0 || loading) && (
                <Card className="mt-2 p-2 max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {results.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result.url)}
                      className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Full Search Bar */}
      <div className="hidden md:block relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search everything..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        {(results.length > 0 || loading) && (
          <Card className="absolute top-full left-0 right-0 mt-2 p-2 max-h-96 overflow-y-auto z-50 bg-background border shadow-lg">
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result.url)}
                className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.title}</p>
                  <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {result.type}
                </Badge>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}