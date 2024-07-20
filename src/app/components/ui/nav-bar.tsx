import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from "lucide-react";
import { getAuthUser } from "~/trpc/get-auth-user";
import AuthNav from "./auth-nav";
const Navbar = async () => {
  const user = await getAuthUser({ shouldRedirect: false });

  return (
    <header>
      <div className="flex items-center justify-between text-sm gap-4 p-2 md:justify-end">
        <Link href="/">Help</Link>
        <Link href="/">Orders & Returns</Link>
        {!user && (
          <>
            <Link href="/register">Register</Link>

            <Link href="/login">Login</Link>
          </>
        )}
        {user && <AuthNav username={user.name} />}{" "}
      </div>
      <nav className="flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          ECOMMERCE
        </Link>
        <div className="flex space-x-12 text-[16px] font-[600] -ml-20">
          {["Categories", "Sale", "Clearance", "New stock", "Trending"].map(
            (category: string, index: number) => (
              <Link href="/" key={index} className="font-bold">
                {category}
              </Link>
            ),
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Search strokeWidth={1} />
          </Link>
          <Link href="/">
            <ShoppingCart strokeWidth={1} />
          </Link>
        </div>
      </nav>
      <div className="flex items-center justify-center bg-slate-100 p-2 font-medium">
        <ChevronLeft strokeWidth={1} />
        <span className="text-sm">Get 10% off on business sign up</span>
        <ChevronRight strokeWidth={1} />
      </div>
    </header>
  );
};

export default Navbar;
