import Link from "next/link";
import SidebarLayout from "../ui/sidebar-layout";
import styles from "./login.module.css";

export default function Login() {
  return (
    <SidebarLayout>
      <Link href="/signup">Sign Up</Link>
      <div className={styles.container}>
        <form className={styles.form}>
          <div>
            <label>Username:</label>
            <input type="text" name="username" />
          </div>
          <div>
            <label>Password:</label>
            <input type="text" name="password" />
          </div>
          <input type="submit" value="Login" />
        </form>
      </div>
    </SidebarLayout>
  );
}
