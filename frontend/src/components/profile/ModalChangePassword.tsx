import { useState } from 'react' // Thêm type FormEvent
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Định nghĩa kiểu cho Props
interface ModalChangePasswordProps {
  isOpenChangePassword: boolean
  handleClosePassword: () => void
  handleChangePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => void
}

export function ModalChangePassword({
  isOpenChangePassword,
  handleClosePassword,
  handleChangePassword,
}: ModalChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState<string>('') // Định nghĩa kiểu string
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  return (
    <Dialog open={isOpenChangePassword} onOpenChange={handleClosePassword}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>パスワードの変更</DialogTitle> {/* Đổi mật khẩu */}
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="old-password">現在のパスワード</Label>
            <Input
              id="old-password" // Thêm id để kết nối với Label
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="new-password">新しいパスワード</Label>
            <Input
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm-password">パスワードの確認</Label>
            <Input
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={handleClosePassword}
              type="button"
              variant="outline"
            >
              キャンセル
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              handleChangePassword(
                currentPassword,
                newPassword,
                confirmPassword,
              )
            } // Đảm bảo đây là nút submit của form
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
