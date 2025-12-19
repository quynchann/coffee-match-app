import { Card } from '../ui/card'
import StyleTag from './StyleTag'

type StyleSelectorProps = {
  styles: Array<string>
  selected: Array<string>
  toggleStyle: (item: string) => void
  isEditing: boolean
  setIsEditing: (val: boolean) => void
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  styles,
  selected,
  toggleStyle,
  isEditing,
}) => (
  <>
    <Card className="p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-primary">スタイル</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {styles.map((item) => (
          <StyleTag
            key={item}
            label={item}
            selected={selected.includes(item)}
            onClick={() => isEditing && toggleStyle(item)}
          />
        ))}
      </div>
    </Card>
  </>
)

export default StyleSelector
