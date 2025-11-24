import { useEffect, useRef, useState } from 'react'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type ProfileInfoProps = {
  fullname: string
  email: string
  address: string
  age: number
  setEmail: (email: string) => void
  setAddress: (address: string) => void
  setAge: (age: number) => void
  isEditing: boolean
  avatar: string // URL avatar hiện tại
  newAvatarFile: File | null // Tệp avatar mới được chọn
  setNewAvatarFile: (file: File | null) => void // Hàm để cập nhật tệp mới
  setIsOpenChangePassword: (v: boolean) => void
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  fullname,
  email,
  address,
  age,
  setEmail,
  setAddress,
  setAge,
  isEditing,
  avatar,
  newAvatarFile,
  setNewAvatarFile,
  setIsOpenChangePassword,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(avatar)
  useEffect(() => {
    if (newAvatarFile) {
      const url = URL.createObjectURL(newAvatarFile)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setPreviewUrl(avatar)
    }
  }, [newAvatarFile, avatar])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewAvatarFile(e.target.files[0])
    }
  }

  return (
    <Card className="p-4 flex flex-col items-center gap-4 h-full w-full">
      <div className="relative">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 cursor-pointer">
          <AvatarImage src={previewUrl} alt="User Avatar" />
          <AvatarFallback className="bg-gray-600 text-white text-3xl md:text-4xl">
            U
          </AvatarFallback>
        </Avatar>

        {isEditing && (
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              name="avatar"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}>
              変更
            </Button>
          </div>
        )}
      </div>

      <h2 className="text-lg md:text-xl font-semibold">{fullname}</h2>

      <div className="w-full space-y-3">
        <div>
          <label className="text-sm">メール</label>
          <Input
            value={email}
            readOnly={!isEditing}
            className="mt-1"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">住所</label>
          <Input
            value={address}
            readOnly={!isEditing}
            className="mt-1"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">年齢</label>
          <Input
            value={age.toString()}
            readOnly={!isEditing}
            className="mt-1"
            type="number"
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
      </div>
      <Button
        variant="profile"
        className="w-full mt-4 cursor-pointer"
        onClick={() => setIsOpenChangePassword(true)}>
        パスワード変更
      </Button>
    </Card>
  )
}

export default ProfileInfo
