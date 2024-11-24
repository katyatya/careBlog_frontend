import React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import Container from '@mui/material/Container'
import { useSelector, useDispatch } from 'react-redux'
import Lottie from 'react-lottie'
import * as animationData from '../../flower.json'
import { logout, selectIsAuth } from '../../redux/slices/auth'

export const Header = () => {
	const isAuth = useSelector(selectIsAuth)
	const dispatch = useDispatch()
	const onClickLogout = () => {
		if (window.confirm('Вы действительно хотите выйти из аккаунта ?')) {
			dispatch(logout())
			window.localStorage.removeItem('token')
		}
	}

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	}

	return (
		<div className={styles.root}>
			<Container maxWidth='lg'>
				<div className={styles.inner}>
					<Link className={styles.logo} to='/' id='flower'>
						<Lottie options={defaultOptions} height={100} width={100} />
						<p style={{ marginBottom: 0 }}>Care Blog</p>
					</Link>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<Link to='/add-post'>
									<Button className={styles.post_but}>Написать статью</Button>
								</Link>
								<Button onClick={onClickLogout} className={styles.logout_but}>
									Выйти
								</Button>
							</>
						) : (
							<>
								<Link to='/login'>
									<Button className={styles.enter_but}>Войти</Button>
								</Link>
								<Link to='/register'>
									<Button className={styles.account_but}>
										Создать аккаунт
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	)
}
