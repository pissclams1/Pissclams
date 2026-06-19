import { createClient, type User } from "@supabase/supabase-js";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getRequestUser(request:Request):Promise<User|null>{
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
  if(!url||!anonKey||!token) return null;
  const client=createClient(url,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await client.auth.getUser(token);
  return error?null:data.user;
}

export function isAdminEmail(email?:string|null){
  const configured=(process.env.GAPSTAY_ADMIN_EMAILS||"andreas11735@gmail.com").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean);
  return Boolean(email&&configured.includes(email.toLowerCase()));
}
