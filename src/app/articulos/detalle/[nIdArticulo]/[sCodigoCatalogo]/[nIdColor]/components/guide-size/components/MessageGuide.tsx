import { SizeMessageText } from "../interfaces/responseGuideSize"

type Props = {
  messages: SizeMessageText[]
}

export const MessageGuide = ({ messages }: Props) => {
  return (
    <div className="p-4 my-2 bg-[#7E2EA21F] rounded-lg text-xs">
      <p>
        {messages.map((data, index) =>
          data.text === '\n' ? (
            <br key={index} />
          ) : data.bold ? (
            <strong key={index}>{data.text}</strong>
          ) : (
            data.text
          )
        )}
      </p>
    </div>
  )
}
