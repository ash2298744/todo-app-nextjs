import { AiFillEye, AiOutlinePlus } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { GoSignOut } from "react-icons/go";


import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

import { collection, addDoc, getDoc, getDocs, where, query, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

export default function Home() {
    const [todoInput, setTodoInput] = useState("");
    const [todos, setTodos] = useState([]);

    const {authUser, isLoading, signOut} = useAuth();

    const router = useRouter();

    const addToDo = async () => {
        try {
            const docRef = await addDoc(collection(db, "todos"), {
                owner: authUser.uid,
                content: todoInput,
                completed: false
            })
            fetchTodos(authUser.uid);
            setTodoInput("");
            console.log("Doc created", docRef.id);
        } catch (error) {
            console.log("Erro occured while creating", error);
        }
    }

    const deleteTodo = async (docId) => {
        try {
            await deleteDoc(doc(db, "todos", docId));
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTodos = async () => {
        try {
            const q = query(collection(db, "todos"), where("owner","==", authUser.uid));
            let data = [];
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                data.push({...doc.data(), id: doc.id})
                console.log(doc.id, "=>", doc.data())
            });
            setTodos(data);
            setTodoInput("");
            
        } catch (error) {
            console.log("Erro occured while fetching", error);
        }
    };

    const markAsCompleted = async (event, docId) => {
        try {
            const docRef = doc(db,"todos", docId);
            await updateDoc(docRef, {
                completed: event.target.checked
            })
            fetchTodos();
        } catch (error) {
            console.error(error);
        }
    };

    const onEnter = (event) => {
        if(event.key === "Enter" && todoInput.length > 0) {
            addToDo();
        }
    }

    useEffect(() => {
        if(!isLoading && !authUser) {
            router.push("/login");
        }
        if(!!authUser) {
            fetchTodos(authUser.uid);
        }
    }, [authUser, isLoading])

    return !authUser ? (<Loader/>) : (
        <main >
            <div className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer" onClick={signOut}>
                <GoSignOut size={18} />
                <span>Logout</span>
            </div>
            <div className="max-w-3xl mx-auto mt-10 p-8">
                <div className="bg-red-500 -m-6 p-3 sticky top-0">
                    <div className="flex justify-center flex-col items-center">
                        <span className="text-7xl mb-10">📅</span>
                        <h1 className="text-5xl md:text-7xl font-bold">
                            ToDo's
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-10">
                        <input
                            placeholder={`✌ Hello there, ${authUser.username}! What's on the agenda for today?`}
                            type="text"
                            className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
                            autoFocus
                            onChange={(e) => setTodoInput(e.target.value)}
                            onKeyUp={(e) => onEnter(e)}
                        />
                        <button className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]" onClick={addToDo}>
                            <AiOutlinePlus size={30} color="#fff" />
                        </button>
                    </div>
                </div>
                <div className="my-10 bg-slate-100 p-2 flex flex-col pb-5">
                    {todos && todos.map((todo, index) => (
                        <div key={todo.id} className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                                <input
                                    id={`todo-${todo.id}`}
                                    type="checkbox"
                                    className="w-4 h-4 accent-green-400 rounded-lg"
                                    checked={todo.completed}
                                    onChange={(e) => markAsCompleted(e, todo.id)}
                                />
                                <label
                                    htmlFor={`todo-${todo.id}`}
                                    className={`font-medium ${todo.completed ? "line-through" : ""}`}
                                >
                                    {todo.content}
                                </label>
                            </div>

                            <div className="flex items-center gap-3" onClick={() => deleteTodo(todo.id)}>
                                <TiDeleteOutline
                                    size={24}
                                    className="text-gray-900 hover:text-red-600 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
