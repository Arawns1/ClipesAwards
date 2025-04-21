import { User } from "@/@types/User";
import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/lib/api/user";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";

function LoginButton() {
  const { login } = useAuth();

  return <Button onClick={login}>Fazer Login</Button>;
}

type LoginAvatarProps = {
  userData?: User;
};
function LoginAvatar({ userData: user }: LoginAvatarProps) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-x-3 cursor-pointer">
          <span className="text-foreground font-medium capitalize text-sm">
            {user?.username}
          </span>
          <Avatar>
            <AvatarImage src={user?.avatar_url} alt={user?.username} />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent side="bottom" align="end" className="mt-2">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer">
            <LogOut />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export default function LoginComponent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, []);

  return user ? <LoginAvatar userData={user} /> : <LoginButton />;
}
