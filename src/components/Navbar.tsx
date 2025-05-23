"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@react-email/components";

function Navbar() {
  const { data: session } = useSession();

  const user: User = session?.user as User;
  return (
    <>
      <nav className="p-4 md:p-6 shadow-md"></nav>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link className="text-xl font-bold mb-4 md:mb-0 " href="#">
          Mystery Message
        </Link>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              className="w-full md:w-auto hover:cursor-pointer"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link className="w-full md:w-auto" href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
