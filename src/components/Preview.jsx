import styled from 'styled-components'
import { vars } from '../style'

const Preview = styled.aside`
    flex: 1;
    min-width: 300px;
    max-width: 520px;
    background: ${vars.cardbg};

    padding: 16px;
    border-radius: 6px;
    box-sizing: border-box;

    /* 모바일에서 결과가 폼 아래로 내려오도록 스타일 조정 */
    @media (max-width: 900px) {
        margin-top: 12px;
        max-width: 100%;
    }
`

const PreviewTitle = styled.div`
    font-weight: 700;
    margin-bottom: 8px;
`

const SubmittedTime = styled.div`
    font-size: 12px;
    color: ${vars.muted};
    margin-bottom: 12px;
`

const Pre = styled.pre`
    background: ${vars.card};
    padding: 12px;
    border-radius: 6px;
    border: 1px solid ${vars.border};
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, 'Noto Sans Mono', monospace;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 13px;
    color: #111827;
    margin: 0;
`

// 추가: 제출 내용 복사 버튼 스타일
const CopyButton = styled.button`
    margin-left: 8px;
    padding: 6px 10px;
    font-size: 13px;
    background: transparent;
    border: 1px solid ${vars.border};
    color: ${vars.muted};
    border-radius: 6px;
    cursor: pointer;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

export default function PreviewComponent({
    previewRef,
    submitted,
    storageKey,
    setForm,
    initialForm,
    setCopied,
    copied,
    setSubmitted,
}) {
    const clearSaved = () => {
        localStorage.removeItem(storageKey)
        setForm(initialForm)
        setCopied(false)
        setSubmitted('')
    }

    const copySubmitted = async () => {
        if (!submitted) return
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(submitted)
            } else {
                // fallback
                const ta = document.createElement('textarea')
                ta.value = submitted
                document.body.appendChild(ta)
                ta.select()
                document.execCommand('copy')
                document.body.removeChild(ta)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('복사 실패', err)
        }
    }
    return (
        <Preview ref={previewRef}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                }}>
                <PreviewTitle>제출 결과</PreviewTitle>
                <CopyButton onClick={copySubmitted} disabled={!submitted}>
                    {copied ? '복사됨' : '복사'}
                </CopyButton>
                <CopyButton
                    type="button"
                    onClick={clearSaved}
                    style={{ marginLeft: 8 }}>
                    저장 지우기
                </CopyButton>
            </div>

            {submitted ? (
                <>
                    <Pre>{submitted}</Pre>
                </>
            ) : (
                <SubmittedTime style={{ color: vars.muted }}>
                    아직 제출된 데이터가 없습니다.
                </SubmittedTime>
            )}
        </Preview>
    )
}
