import {
    provideFluentDesignSystem,
    fluentAccordion,
    fluentAccordionItem,
    fluentAnchor,
    fluentButton,
    fluentCombobox,
    fluentOption,
    fluentSelect,
    fluentTextField
} from "@fluentui/web-components";
provideFluentDesignSystem()
    .register(
        fluentAccordion(),
        fluentAccordionItem(),
        fluentAnchor(),
        fluentButton(),
        fluentCombobox(),
        fluentOption(),
        fluentSelect(),
        fluentTextField()
    );