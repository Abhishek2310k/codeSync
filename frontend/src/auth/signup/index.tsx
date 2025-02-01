import { Form } from "radix-ui";
import { useState } from "react";
import axios from "axios"
import "./styles.css";

const Signup = () => {
	const [user, setUser] = useState<{username:string,password:string}>({username:"",password:""});	

	const changeState = (e: React.ChangeEvent<HTMLInputElement>) => {
		const type = e.target.name;
		const change = e.target.value;	  
		setUser({ ...user, [type]: change });
	  };

	async function submit (e:React.FormEvent<HTMLFormElement>):Promise<void> {
		e.preventDefault();
		try {
			const resp = await axios.post("http://localhost:3000/auth/signup",user);
			if(resp.status == 200) alert("user signed up");
			else {
				alert("please retry perhaps with a different id");
			}

		} catch (err) {
			console.log(err);
		}
	}

	return (
	<div className="signupForm">
	<h1> Signup Form </h1>
	<Form.Root className="FormRoot" onSubmit={submit}>
		<Form.Field className="FormField" name="email">
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					justifyContent: "space-between",
				}}
			>
				<Form.Label className="FormLabel">UserName</Form.Label>
				<Form.Message className="FormMessage" match="valueMissing">
					Please enter your username
				</Form.Message>
				<Form.Message className="FormMessage" match="typeMismatch">
					Please provide a valid email
				</Form.Message>
			</div>
			<Form.Control asChild>
				<input className="Input" type="text" required value={user.username} onChange={(e)=>changeState(e)} name="username"/>
			</Form.Control>
		</Form.Field>

		<Form.Field className="FormField" name="password">
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					justifyContent: "space-between",
				}}
			>
				<Form.Label className="FormLabel">Password</Form.Label>
				<Form.Message className="FormMessage" match="valueMissing">
					Please enter your password
				</Form.Message>
			</div>
			<Form.Control asChild>
				<input className="Input" type="password" required value={user.password} onChange={(e)=>changeState(e)} name="password"/>
			</Form.Control>
		</Form.Field>
		
		<Form.Submit asChild>
			<button className="Button" style={{ marginTop: 10 }}>
				Post question
			</button>
		</Form.Submit>
	</Form.Root>
	</div>
	)
};

export default Signup;
