import React from 'react'
import styles from './UserInfo.module.scss'

export const UserInfo = ({ avatar_url, full_name, additionalText }) => {
	return (
		<div className={styles.root}>
			<img
				className={styles.avatar}
				src={
					avatar_url
						? `${process.env.REACT_APP_API_URL}${avatar_url}`
						: '/noavatar.png'
				}
				alt={full_name}
			/>
			<div className={styles.userDetails}>
				<span className={styles.userName}>{full_name}</span>
				<span className={styles.additional}>
					{additionalText.replace(
						/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*/,
						'$3-$2-$1 $4:$5'
					)}
				</span>
			</div>
		</div>
	)
}
