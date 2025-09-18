// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { hasNonEmptyProp } from "./hasNonEmptyProp";
import {
    hasAssociatedLabelViaAriaLabelledBy,
    isInsideLabelTag,
    hasAssociatedLabelViaHtmlFor,
    hasAssociatedLabelViaAriaDescribedby
} from "./labelUtils";
import { hasFieldParent } from "./hasFieldParent";
import { elementType } from "jsx-ast-utils";
import { JSXOpeningElement } from "estree-jsx";
import { hasToolTipParent } from "./hasTooltipParent";
import { hasLabeledChild } from "./hasLabeledChild";
import { hasTextContentChild } from "./hasTextContentChild";
import { hasTriggerProp } from "./hasTriggerProp";

export type LabeledControlConfig = {
    component: string | RegExp;
    messageId: string;
    description: string;
    labelProps: string[]; // e.g. ["aria-label", "title", "label"]
    allowFieldParent: boolean; // Accept a parent <Field label="..."> wrapper as providing the label.
    allowHtmlFor: boolean; // Accept <label htmlFor="..."> association.
    allowLabelledBy: boolean; // Accept aria-labelledby association.
    allowWrappingLabel: boolean; // Accept being wrapped in a <label> element.
    allowTooltipParent: boolean; // Accept a parent <Tooltip content="..."> wrapper as providing the label.
    /**
     * Accept aria-describedby as a labeling strategy.
     * NOTE: This is discouraged for *primary* labeling; prefer text/aria-label/labelledby.
     * Keep this off unless a specific component (e.g., Icon-only buttons) intentionally uses it.
     */
    allowDescribedBy: boolean;
    allowLabeledChild: boolean; // Accept labeled child elements to provide the label e.g. <Button><img alt="..." /></Button>
    allowTextContentChild?: boolean; // Accept text children to provide the label e.g. <Button>Click me</Button>
    /** Only apply rule when this trigger prop is present (e.g., "dismissible", "disabled") */
    triggerProp?: string;
    /** Custom validation function for complex scenarios */
    customValidator?: Function;
};

/**
 * Returns `true` if the JSX opening element is considered **accessibly labelled**
 * per the rule configuration. This centralizes all supported labeling strategies.
 *
 * Supported strategies (gated by config flags):
 *  1) Parent <Field label="..."> context .............................. (allowFieldParent)
 *  2) Non-empty inline prop(s) like aria-label/title .................. (labelProps)
 *  3) Wrapped by a <label> ............................................ (allowWrappingLabel)
 *  4) <label htmlFor="..."> / htmlFor association ..................... (allowFor)
 *  5) aria-labelledby association ..................................... (allowLabelledBy)
 *  6) Parent <Tooltip content="..."> context .......................... (allowTooltipParent)
 *  7) aria-describedby association (opt-in; discouraged as primary) .... (allowDescribedBy)
 *  8) treat labeled child content (img alt, svg title, aria-label on role="img") as the name
 *  9) Conditional application based on trigger prop ................... (triggerProp)
 * 10) Custom validation for complex scenarios ......................... (customValidator)
 *
 * This checks for presence of an accessible *name* only; not contrast or UX.
 */
export function hasAccessibleLabel(
    opening: TSESTree.JSXOpeningElement,
    element: TSESTree.JSXElement,
    context: TSESLint.RuleContext<string, []>,
    config: LabeledControlConfig
): boolean {
    const allowFieldParent = !!config.allowFieldParent;
    const allowWrappingLabel = !!config.allowWrappingLabel;
    const allowHtmlFor = !!config.allowHtmlFor;
    const allowLabelledBy = !!config.allowLabelledBy;
    const allowTooltipParent = !!config.allowTooltipParent;
    const allowDescribedBy = !!config.allowDescribedBy;
    const allowLabeledChild = !!config.allowLabeledChild;
    const allowTextContentChild = !!config.allowTextContentChild;
    if (allowFieldParent && hasFieldParent(context)) return true;
    if (config.labelProps?.some(p => hasNonEmptyProp(opening.attributes, p))) return true;
    if (allowWrappingLabel && isInsideLabelTag(context)) return true;
    if (allowHtmlFor && hasAssociatedLabelViaHtmlFor(opening, context)) return true;
    if (allowLabelledBy && hasAssociatedLabelViaAriaLabelledBy(opening, context)) return true;
    if (allowTooltipParent && hasToolTipParent(context)) return true;
    if (allowDescribedBy && hasAssociatedLabelViaAriaDescribedby(opening, context)) return true;
    if (allowLabeledChild && hasLabeledChild(opening, context)) return true;
    if (allowTextContentChild && hasTextContentChild(element)) return true;
    return false;
}

/**
 * Factory for a minimal, strongly-configurable ESLint rule that enforces
 * accessible labeling on a specific JSX element/component.
 */
export function makeLabeledControlRule(config: LabeledControlConfig): TSESLint.RuleModule<string, []> {
    return {
        meta: {
            type: "problem",
            messages: { [config.messageId]: config.description },
            docs: {
                description: config.description,
                recommended: "strict",
                url: "https://www.w3.org/TR/html-aria/"
            },
            schema: []
        },
        defaultOptions: [],

        create(context: TSESLint.RuleContext<string, []>) {
            return {
                JSXElement(node: TSESTree.JSXElement) {
                    const opening = node.openingElement;
                    const name = elementType(opening as unknown as JSXOpeningElement);
                    const matches = typeof config.component === "string" ? name === config.component : config.component.test(name);

                    if (!matches) return;

                    if (config.triggerProp && !hasTriggerProp(opening, config.triggerProp)) {
                        return;
                    }

                    // Use custom validator if provided, otherwise use standard accessibility check
                    let isValid: boolean;
                    config.customValidator
                        ? (isValid = config.customValidator(opening))
                        : (isValid = hasAccessibleLabel(opening, node, context, config));

                    if (!isValid) {
                        // report on the opening tag for better location
                        context.report({ node: opening, messageId: config.messageId });
                    }
                }
            };
        }
    };
}
