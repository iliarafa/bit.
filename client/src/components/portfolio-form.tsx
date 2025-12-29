import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
});

interface PortfolioFormProps {
  onAdd: (amount: number, price: number) => void;
  currentPrice: number | null;
}

export function PortfolioForm({ onAdd, currentPrice }: PortfolioFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      price: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd(Number(values.amount), Number(values.price));
    form.reset({ amount: "", price: currentPrice ? currentPrice.toString() : "" });
  }

  // Auto-fill price if available and field is empty (optional convenience)
  // But let's keep it simple for now and let user type.

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Plus className="h-5 w-5" />
          Add Transaction
        </CardTitle>
        <CardDescription>Enter details of your Bitcoin purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BTC Amount</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.05" 
                        type="number"
                        step="any"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors"
                        data-testid="input-btc-amount"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">How much Bitcoin you bought</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per BTC (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={currentPrice ? currentPrice.toLocaleString() : "50000"} 
                        type="number"
                        step="any"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors"
                         data-testid="input-btc-price"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">BTC price when you bought (e.g., {currentPrice ? `$${currentPrice.toLocaleString()}` : '$87,000'})</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full font-semibold" data-testid="button-add-transaction">
              Add to Portfolio
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
