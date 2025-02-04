import isEmpty from 'lodash.isempty'
import React from 'react'

export default function useCriterionComponent (props) {
  const {
    value,
    onChange,
    criterionInfo,
    disabled = false
  } = props

  return React.useMemo(() => {
    if (criterionInfo == null) return null

    const CriterionComponent = criterionInfo.component.component

    const {
      value: _,
      label: __,
      onChange: ___,
      disabled: ____,
      ...criterionProps
    } = criterionInfo.component.props

    let multipleValue = criterionProps.multiple ? [] : ''
    if (!isEmpty(value)) {
      multipleValue = value
    }

    return (
      <CriterionComponent
        value={multipleValue}
        disabled={disabled}
        label={criterionInfo.label}
        onChange={(v)=>{
          onChange(v)
        }}
        {...criterionProps}
      />
    )
  }, [value, onChange, disabled, criterionInfo])
}
