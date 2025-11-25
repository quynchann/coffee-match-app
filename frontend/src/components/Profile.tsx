import { useEffect, useState } from 'react'
import { getProfile, updatePassword, updateProfile } from '@/services/api'
import { toast } from 'sonner'
import ProfileInfo from './profile/ProfileInfo'
import StyleSelector from './profile/StyleSelector'
import { Button } from './ui/button'
import { ModalChangePassword } from './profile/ModalChangePassword'

export default function ProfilePage() {
  const baseURLImage = `${import.meta.env.VITE_BASE_URL_BACKEND}/images/avatar`
  const [profileUser, setProfileUser] = useState<IProfile | undefined>()

  const [email, setEmail] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [age, setAge] = useState<number>(0)

  const [styles, setStyles] = useState<string[]>([
    '勉強',
    'デート',
    '子供向け',
    '一人',
    '学生',
    '大人',
    'ファミリー',
    'シニア',
    '24h',
    '電源',
    'Wi-Fi',
    'ペット',
    '長居可',
    '静か',
    '禁煙',
    '喫煙席あり',
    'おしゃれ',
    '落ち着いた',
    'モダン',
    'ナチュラル',
    'レトロ',
    '隠れ家',
    '写真映え',
    '落ち着いた2',
  ])

  const [selected, setSelected] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null) // State mới cho tệp
  const [isOpenChangePassword, setIsOpenChangePassword] =
    useState<boolean>(false)

  const fetchData = async () => {
    const res = await getProfile()
    try {
      if (res.data?.data) {
        const profile = res.data.data
        setProfileUser(profile)

        // Set tất cả state từ backend
        setEmail(profile.email)
        setAddress(profile.address)
        setAge(profile.age)
        setSelected(profile.styles || [])
      }
    } catch (err: any) {
      console.error('Error fetching profile:', res.data.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleStyle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('address', address)
      formData.append('age', age.toString())
      selected.forEach((style) => formData.append('styles', style))

      if (newAvatarFile) {
        formData.append('avatar', newAvatarFile)
      }

      const res = await updateProfile(formData)
      console.log('res', res)

      if (res.data.success) {
        toast.success('正常に編集されました', {
          description: res.data.message,
        })
        setIsEditing(false)
      } else {
        toast.error('エラーが発生しました', {
          description:
            res.data.message || res.data.error || '不明なエラーです。',
        })
      }
    } catch (err: any) {
      console.error('Error updating profile:', err)
      toast.error('エラーが発生しました', {
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          '不明なエラーです。',
      })
    }
  }

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    try {
      const res = await updatePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      )

      if (res.data.success) {
        toast.success('パスワードが変更されました！')
        setIsOpenChangePassword(false)
      } else {
        toast.error(res.data.message || 'エラーが発生しました！')
      }
    } catch (err: any) {
      console.log('error', err.response?.data || err)
      toast.error(
        err.response?.data?.message || 'サーバーエラーが発生しました！',
      )
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 space-y-6 p-6 w-full min-h-[calc(100vh-160px)]">
        <div className="col-span-1">
          <ProfileInfo
            fullname={profileUser?.name ?? ''}
            email={email}
            address={address}
            age={age}
            isEditing={isEditing}
            setAge={setAge}
            setAddress={setAddress}
            setEmail={setEmail}
            avatar={`${baseURLImage}/${profileUser?.avatar}`}
            newAvatarFile={newAvatarFile}
            setNewAvatarFile={setNewAvatarFile}
            setIsOpenChangePassword={setIsOpenChangePassword}
          />
        </div>

        <div className="col-span-2">
          <StyleSelector
            styles={styles}
            selected={selected}
            toggleStyle={toggleStyle}
            isEditing={isEditing}
            setIsEditing={() => {
              setIsEditing(false)
            }}
          />
        </div>

        <div className="w-full flex justify-center md:col-span-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="profile"
              className="cursor-pointer">
              編集
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  handleSave()
                }}
                className="cursor-pointer"
                variant="primary">
                保存
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  fetchData()
                }}
                className="cursor-pointer"
                variant="profile">
                キャンセル
              </Button>
            </div>
          )}
        </div>
      </div>
      <ModalChangePassword
        isOpenChangePassword={isOpenChangePassword}
        handleClosePassword={() => setIsOpenChangePassword(false)}
        handleChangePassword={handleChangePassword}
      />
    </div>
  )
}
