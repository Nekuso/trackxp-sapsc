"use client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/sapsc-logo-light.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInWithEmailAndPassword } from "@/lib/actions";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email({ message: "Must be a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export default function Login() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      const result = await signInWithEmailAndPassword(data);

      const { error } = JSON.parse(result);
      if (error?.message) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        return;
      }

      toast({
        description: "Login successful",
      });
      return redirect("/application");
    });
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center place-items-center overflow-hidden">
      <div className="flex flex-col gap-10 p-6 place-items-center md:min-w-[400px] h-auto bg-darkGray rounded-2xl shadow-lg border border-lightBorder">
        <Image
          src={Logo}
          alt="Sentro Auto Parts & Service Center"
          onClick={() => router.push("https://trackxp-sapsc.vercel.app/")}
        />
        <Form {...form}>
          <form
            className="flex flex-col w-full gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col w-full gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Email</FormLabel>
                      <FormControl>
                        <input
                          title="email"
                          type="text"
                          placeholder="Enter your email"
                          className="w-full text-sm px-5 py-2.5 rounded-md bg-foregroundBg text-white border border-lightBorder "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col w-full gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Password</FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="••••••••••"
                          className="w-full text-sm px-5 py-2.5 rounded-md bg-foregroundBg text-white border border-lightBorder "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full flex gap-4 text-white text-sm px-5 py-2.5 text-center  bg-applicationPrimary hover:bg-applicationPrimary/70 font-bold rounded-lg transition-all duration-300 "
            >
              <span className={cn({ hidden: isPending })}>Login</span>
              <AiOutlineLoading3Quarters
                className={cn(" animate-spin", { hidden: !isPending })}
              />
            </Button>
          </form>
        </Form>
        <h3 className="text-white text-sm flex gap-3">
          Having trouble logging in?{" "}
          <Link
            href={"/"}
            className="text-sm font-bold underline underline-offset-4"
          >
            Contact Admin
          </Link>
        </h3>
      </div>
    </div>
  );
}
