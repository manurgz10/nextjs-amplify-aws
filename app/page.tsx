"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function createTodo() {
    const content = window.prompt("Añade un nuevo todo");
    if (content) {
      client.models.Todo.create({
        content,
      });
    }
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ nuevo</button>
      <ul>
        {todos.map((todo) => (
          <div>
            <li className="delete-li" key={todo.id}>{todo.content}<button onClick={() => deleteTodo(todo.id)} className="delete-button">-</button>
            </li>
            </div>
        ))}
      </ul>
      <div>
        🥳 App Todo creada desplegada en AWS Amplify
        <br />
      </div>
    </main>
  );
}
