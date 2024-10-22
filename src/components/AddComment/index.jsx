import React from 'react'

import styles from './AddComment.module.scss'
import axios from '../../axios'
import { Link, useNavigate } from 'react-router-dom'

import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

export const Index = ({ param, post_id, user_id }) => {
	const [text, setText] = React.useState('')
	const navigate = useNavigate()

	const onSubmit = async () => {
		const fields = {
			comment_text: text,
			post_id,
			user_id,
		}
		try {
			await axios.post(`/posts/${post_id}`, fields)
			navigate(`/posts/${post_id}`)
		} catch (err) {
			alert('Ошибка загрузки комментария')
		}
	}

	return (
		<>
			<div className={styles.root}>
				<Avatar classes={{ root: styles.avatar }} src={param} />
				<div className={styles.form}>
					<TextField
						label='Написать комментарий'
						variant='outlined'
						maxRows={10}
						onChange={e => setText(e.target.value)}
						multiline
						fullWidth
					/>
					<Button onClick={onSubmit} variant='contained'>
						Отправить
					</Button>
				</div>
			</div>
		</>
	)
}
