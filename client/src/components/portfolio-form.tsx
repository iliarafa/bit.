import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ArrowUpRight } from 'lucide-react';

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Cost must be a non-negative number",
  }),
});

interface PortfolioFormProps {
  onAdd: (type: 'buy' | 'send', amount: number, price: number) => void;
  currentPrice: number | null;
}

export function PortfolioForm({ onAdd, currentPrice }: PortfolioFormProps) {
  const [txType, setTxType] = useState<'buy' | 'send'>('buy');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      price: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAdd(txType, Number(values.amount), Number(values.price));
    form.reset({ amount: "", price: "" });
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          {txType === 'buy' ? <Plus className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
          Add Transaction
        </CardTitle>
        <CardDescription>
          {txType === 'buy' ? 'Enter details of your Bitcoin purchase' : 'Record Bitcoin you sent out'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={txType} onValueChange={(v) => setTxType(v as 'buy' | 'send')} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" data-testid="tab-buy">Buy</TabsTrigger>
            <TabsTrigger value="send" data-testid="tab-send">Send</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
                        placeholder="0.00" 
                        type="number"
                        step="any"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors"
                        data-testid="input-btc-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{txType === 'buy' ? 'Total Cost (USD)' : 'Value at Send (USD)'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="$0.00" 
                        type="number"
                        step="any"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors"
                         data-testid="input-btc-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full font-semibold" 
              data-testid="button-add-transaction"
              variant={txType === 'send' ? 'secondary' : 'default'}
            >
              {txType === 'buy' ? 'Add to Portfolio' : 'Record Send'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
