import { Carts, Products, User, Ticket, Chat } from "../dao/factory.js";
import CartRepository from "./cart.repository.js";
import ChatRepository from "./chat.repository.js";
import ProductRepository from './product.repository.js'
import TicketRepository from "./ticket.repository.js";
import UserRepository from "./user.repository.js";

export const ProductService = new ProductRepository(Products)
export const CartService = new CartRepository(Carts)
export const UserService = new UserRepository(User)
export const TicketService = new TicketRepository(Ticket)
export const ChatService = new ChatRepository(Chat)