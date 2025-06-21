'use client';

import signInCover from '@/assets/pngs/naga-cover.png';
import quoteLine from '@/assets/pngs/quote-line.png';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import NavKeys from '@/constants/navkeys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader3 } from '@tabler/icons-react';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username is required.',
  }),
  password: z.string().min(1, {
    message: 'Password must be at least 6 characters.',
  }),
});

const Login = () => {
  const { signInWithPassword } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInWithPassword.mutate(values, {
      onSuccess: () => {
        toast.success('Sign in successful!', { id: 'sign-in' });
        router.push(NavKeys.DashboardOverview);
      },
      onError: (error: any) => {
        console.error('Login failed:', error);
        toast.error(
          error?.response?.data?.message ||
            'Sign in failed. Please check your credentials.',
          { id: 'sign-in' }
        );
      },
    });
  }

  return (
    <section className="font-inter flex h-screen flex-col md:flex-row">
      <div className="flex h-full w-full flex-col justify-center md:h-auto md:w-1/2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-[90%] space-y-4 md:w-[60%]"
          >
            <div className="flex flex-col items-center justify-center gap-2 pb-6">
              <div>
                <img src="/naga-logo.png" alt="logo" className="h-auto w-25" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-montserrat text-3xl font-bold">Log In</h3>
                <h6 className="text-sm text-gray-500">
                  {new Date().getHours() < 12
                    ? 'Good Morning'
                    : new Date().getHours() < 18
                      ? 'Good Afternoon'
                      : 'Good Evening'}
                  ! Please enter your credentials.
                </h6>
              </div>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                      <Input
                        className="pl-10"
                        placeholder="eg: 28092002"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                      <Input
                        className="pl-10"
                        type="password"
                        placeholder="eg: *********"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full rounded-md p-2 transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={signInWithPassword.isPending}
            >
              <div className="flex items-center justify-center gap-2">
                {signInWithPassword.isPending && (
                  <IconLoader3 className="h-4 w-4 animate-spin" />
                )}
                {signInWithPassword.isPending ? 'Signing In...' : 'Log In'}
              </div>
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="bg-freshleaf relative hidden h-1/2 w-full flex-col items-center justify-center bg-contain bg-center bg-no-repeat px-20 md:flex md:h-auto md:w-1/2"
        style={{ backgroundImage: `url(${signInCover.src})` }}
      >
        <div className="text-centerflex flex h-fit flex-col gap-10 text-center text-neutral-200">
          <div>
            <img
              src={quoteLine.src}
              alt="quote-line"
              className="h-auto w-full"
            />
          </div>
          <div className="space-y-2">
            <TextAnimate
              className="text-3xl font-semibold"
              animation="blurInUp"
              by="character"
              once
            >
              Welcome to Naga Limited
            </TextAnimate>
            <TextAnimate
              className="px-20 text-base"
              animation="blurInUp"
              by="line"
              as="p"
              delay={0.5}
              once
            >
              {`Please log in to access your dashboard and manage your operations efficiently.`}
            </TextAnimate>
          </div>

          <div>
            <img
              src={quoteLine.src}
              alt="quote-line"
              className="h-auto w-full rotate-180"
            />
          </div>
        </div>

        <div className="absolute right-0 bottom-6 left-0 flex flex-col items-center justify-center gap-1 text-white">
          <div className="text-base">Since 1962</div>
          <div className="text-xs">Powering Food, Hygiene, Minerals</div>
        </div>

        {/* The grids below are just those cute little dots my dude */}
        <div className="absolute top-0 left-0">
          <div>
            <div className="grid grid-cols-7 grid-rows-6 gap-1">
              {Array.from({ length: 35 }).map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-neutral-100 opacity-90"
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0">
          <div>
            <div className="grid rotate-180 grid-cols-7 grid-rows-6 gap-1">
              {Array.from({ length: 35 }).map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-neutral-100 opacity-90"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
