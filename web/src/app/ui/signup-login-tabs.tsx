import Link from "next/link";

interface SignupLoginTabsProps {
  isLoginActive: boolean;
}

export default function SignupLoginTabs(props: SignupLoginTabsProps) {
  return (
    <div className="my-4 flex flex-col gap-2 items-center">
      <div className="flex flex-row gap-4">
        <Link
          className={`text-white text-5xl ${!props.isLoginActive && "bg-primary"}`}
          href="/signup"
        >
          SIGN UP
        </Link>
        <div className="h-full w-0.5 bg-secondary block"></div>
        <Link
          className={`text-white text-5xl ${props.isLoginActive && "bg-primary"}`}
          href="/login"
        >
          LOGIN
        </Link>
      </div>
      <div className="w-full h-0.5 bg-secondary block"></div>
    </div>
  );
}
