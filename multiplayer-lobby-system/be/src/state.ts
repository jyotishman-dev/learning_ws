import type { Lobby, Player } from "./types";

export const onlineUser  = new Map<string, Player>();


export const lobbies = new Map<string, Lobby>();



export const rateLimits = new Map<string , {count :number , resetAt:number}>();
