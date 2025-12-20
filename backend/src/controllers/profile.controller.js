import profileService from '@/services/profile.service.js'

async function getProfile(req, res) {
  const userId = req.user.id

  if (!userId) {
    return res.status(400).json({ message: 'ユーザーIDが必要です。' })
  }

  try {
    const profile = await profileService.getUserProfile(userId)

    if (!profile) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' })
    }

    return res.status(200).json({
      success: true,
      message: 'プロフィールを取得しました。',
      data: profile
    })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({
      success: false,
      message: 'プロフィールの取得中にエラーが発生しました。',
      error: error.message
    })
  }
}

async function updateProfile(req, res) {
  const userId = req.user.id
  const profileData = req.body
  const { email, address, age, styles } = profileData

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'メールアドレスは必須です。' // Email bắt buộc
    })
  }
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'メールアドレスの形式が正しくありません。' // Email không hợp lệ
    })
  }

  if (!address && typeof address !== 'string') {
    return res.status(400).json({
      success: false,
      message: '住所の形式が正しくありません。' // Address không hợp lệ
    })
  }

  if (age !== undefined && age !== '') {
    const ageNum = Number(age)

    if (!Number.isFinite(ageNum) || ageNum < 10 || ageNum > 100) {
      return res.status(400).json({
        success: false,
        message: '年齢は正しい数値で入力してください。'
      })
    }
  }

  let avatarPath = null
  if (req.file) {
    avatarPath = req.file.filename
  }

  try {
    const updatedProfile = await profileService.updateProfile(
      userId,
      profileData,
      avatarPath
    )

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'ユーザーが見つからない、または更新に失敗しました。'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'プロフィールが正常に更新されました。',
      data: updatedProfile
    })
  } catch (error) {
    console.error('Error in UserController.updateProfile:', error)
    return res.status(500).json({
      success: false,
      message: 'プロフィールの更新中にエラーが発生しました。',
      error: error.message
    })
  }
}

async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body
  const userId = req.user.id

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'すべての項目を入力してください。'
    })
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: '新しいパスワードと確認パスワードが一致しません。'
    })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: '新しいパスワードは6文字以上で入力してください。'
    })
  }

  try {
    await profileService.changePassword(userId, currentPassword, newPassword)

    return res.status(200).json({
      success: true,
      data: [],
      message: 'パスワードが正常に変更されました。再度ログインしてください。'
    })
  } catch (error) {
    if (error.message.includes('パスワード')) {
      return res.status(403).json({
        success: false,
        message: error.message
      })
    }

    console.error('Change Password Error:', error)
    return res.status(500).json({
      success: false,
      message: 'パスワード変更中にエラーが発生しました。',
      error: error.message
    })
  }
}

export default {
  getProfile,
  updateProfile,
  changePassword
}
