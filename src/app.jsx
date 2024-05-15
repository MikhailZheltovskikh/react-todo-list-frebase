import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { Form, TodoItem, Loader, Serach } from './Components';
import { ref, onValue, push } from 'firebase/database';
import { db } from './firebase';

export const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [todos, setTodos] = useState([]);

	const [search, setSearch] = useState();

	const creatingTodo = async (event) => {
		const todoDbTodo = ref(db, 'todo');

		setIsLoading(true);
		event.preventDefault();

		const form = event.target;
		const todoTitle = form.elements.textToDo.value;

		push(todoDbTodo, {
			title: todoTitle,
			completed: false,
		});

		form.reset();
		setIsLoading(false);
	};

	const updateTodo = async (id, payload) => {
		setIsLoading(true);
		try {
			const response = await fetch(`http://localhost:3005/todo/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify({ title: payload }),
			});

			const updatePost = await response.json();

			//  поиск по индексу
			const updateIndexPost = todos.findIndex((post) => post.id === id);
			const copyTodo = todos.slice();
			copyTodo[updateIndexPost] = updatePost;

			setTodos(copyTodo);

			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const deleteTodo = async (id) => {
		setIsLoading(true);

		try {
			await fetch(`http://localhost:3005/todo/${id}`, {
				method: 'DELETE',
			});
			setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const updateStatusTodo = async (id, checked) => {
		setIsLoading(true);

		try {
			const response = await fetch(`http://localhost:3005/todo/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify({
					completed: checked,
				}),
			});

			const updatePost = await response.json();

			//  поиск по индексу
			const updateIndexPost = todos.findIndex((post) => post.id === id);
			const copyTodo = todos.slice();
			copyTodo[updateIndexPost] = updatePost;

			setTodos(copyTodo);

			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const searchTodo = (event) => {
		setSearch(event);
	};

	const hendelSertTodo = () => {
		const sortedTodos = [...todos].sort((a, b) => {
			if (a.title < b.title) return -1;
			if (a.title > b.title) return 1;
			return 0;
		});
		setTodos(sortedTodos);
	};

	useEffect(() => {
		const todoDbTodo = ref(db, 'todo');

		return onValue(todoDbTodo, (snapshot) => {
			const loadedTodos = snapshot.val();

			setTodos(loadedTodos);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className={styles.app}>
			<h1>To-Do</h1>
			<Serach searchTodo={searchTodo} />
			<Form onSubmit={creatingTodo} />

			<button className={styles.sort__btn} onClick={hendelSertTodo}>
				Сортировка ⇩
			</button>

			<ul className={styles.toDoList}>
				{isLoading ? (
					<Loader />
				) : (
					<>
						{Object.entries(todos).map(([id, {title, completed }]) => (
							<TodoItem
								key={id}
								title={title}
								completed={completed}
								updateTodo={updateTodo}
								deleteTodo={deleteTodo}
								updateStatusTodo={updateStatusTodo}
							/>
						))}
					</>
				)}
			</ul>
		</div>
	);
};
