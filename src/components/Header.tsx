import NavBar from "@/components/NavBar";
import { ProcessDialog } from "./process-dialog";
import { SignInDialog } from "./sign-in-dialog";

export default async function Header() {
  return (
    <header>
      <div className="">
        <ProcessDialog />
      </div>
      <div>
        <SignInDialog />
      </div>
      <NavBar />
    </header>
  );
}
