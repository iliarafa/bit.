import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ArrowUpRight, Zap } from 'lucide-react';

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Cost must be a non-negative number",
  }),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

interface PortfolioFormProps {
  onAdd: (type: 'buy' | 'send', amount: number, price: number, date: string) => void;
  currentPrice: number | null;
}

export function PortfolioForm({ onAdd, currentPrice }: PortfolioFormProps) {
  const [txType, setTxType] = useState<'buy' | 'send'>('buy');
  
  const now = new Date();
  const defaultDate = format(now, 'yyyy-MM-dd');
  const defaultTime = format(now, 'HH:mm');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      price: "",
      date: defaultDate,
      time: defaultTime,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dateTime = new Date(`${values.date}T${values.time}`).toISOString();
    onAdd(txType, Number(values.amount), Number(values.price), dateTime);
    const now = new Date();
    form.reset({ 
      amount: "", 
      price: "", 
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm')
    });
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-primary text-base sm:text-lg">
          {txType === 'buy' ? <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />}
          Add Transaction
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {txType === 'buy' ? 'Enter details of your Bitcoin purchase' : 'Record Bitcoin you sent out'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={txType} onValueChange={(v) => setTxType(v as 'buy' | 'send')} className="mb-4">
          <TabsList className="grid w-full grid-cols-2 h-10 sm:h-9">
            <TabsTrigger value="buy" className="text-sm" data-testid="tab-buy">Buy</TabsTrigger>
            <TabsTrigger value="send" className="text-sm" data-testid="tab-send">Send</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">BTC Amount</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.00" 
                        type="number"
                        step="any"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11 sm:h-10 text-base sm:text-sm"
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
                    <FormLabel className="text-xs sm:text-sm">{txType === 'buy' ? 'Total Cost (USD)' : 'Value at Send (USD)'}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="$0.00" 
                          type="number"
                          step="any"
                          {...field} 
                          className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11 sm:h-10 text-base sm:text-sm"
                          data-testid="input-btc-price"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 sm:h-10 w-11 sm:w-10 shrink-0 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                        onClick={() => {
                          const amount = Number(form.getValues('amount'));
                          if (currentPrice && amount > 0) {
                            const total = (amount * currentPrice).toFixed(2);
                            form.setValue('price', total);
                          }
                        }}
                        disabled={!currentPrice}
                        title="Use current BTC price"
                        data-testid="button-use-current-price"
                      >
                        <Zap className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11 sm:h-10 text-base sm:text-sm"
                        data-testid="input-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...field} 
                        className="font-mono bg-background/50 border-input/50 focus:border-primary/50 transition-colors h-11 sm:h-10 text-base sm:text-sm"
                        data-testid="input-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full font-semibold h-11 sm:h-10 text-sm" 
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
