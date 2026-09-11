"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";

export default function Home() {
  const router = useRouter();
  const { user, isFetched } = useUser();

  useEffect(() => {
    if(user && user.id) {
      router.push("/dashboard");
    }
    else if(isFetched && !user) {
      router.push("/login");
    }
  }, [isFetched, user, router]);

 return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>{JSON.stringify(user, null, 2)}</div>
    </main>
  );
}